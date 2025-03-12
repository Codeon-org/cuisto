import { DateTime } from "luxon";
import { z } from "zod";

const bodySchema = z.object({
    identifier: z.union([validation.user.username, validation.user.email]),
    password: validation.user.password,
});

export default defineEventHandler(async (event) =>
{
    // Get credentials from the request body
    const body = await readValidatedBody(event, bodySchema.parse);

    // Check if the user exist
    const user = await prisma.user.findFirst({
        select: {
            id: true,
            password: true,
            roles: true,
            email: true
        },
        where: {
            OR: [
                { username: body.identifier },
                { email: body.identifier }
            ]
        },
    });

    if (!user)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "No user found"
        });
    }

    // Verify the password
    const passwordValid = await verifyHash(user.password, body.password);
    if (!passwordValid)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid password"
        });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken({ id: user.id, roles: user.roles });

    const refreshToken = await generateRefreshToken();
    const fingerprint = await getFingerprint(event);
    const refreshTokenExpiresAt = DateTime.now().toUTC().plus({ days: 90 }).toJSDate();

    const existingRefreshToken = await prisma.refreshToken.findFirst({
        where: {
            AND: [
                { userId: user.id },
                {deviceFingerprint: fingerprint}
            ]
        }
    });

    if(existingRefreshToken) {
        await prisma.refreshToken.update({
            data: {
                expiresAt: refreshTokenExpiresAt,
                token: sha512(refreshToken)
            },
            where: {
                id: existingRefreshToken.id
            }
        });
    } else {
        await prisma.refreshToken.create({
            data: {
                token: sha512(refreshToken),
                userId: user.id,
                expiresAt: refreshTokenExpiresAt,
                deviceFingerprint: fingerprint
            },
        });

        await sendMjmlMail({
            params: {
                deviceName: getUserAgent(event).browser ?? "Unknown",
                ip: getIpAddress(event).v4 ?? getIpAddress(event).v6 ?? "Unknown",
                time: DateTime.now().toUTC().toLocaleString(DateTime.DATETIME_FULL,)
            },
            to: user.email,
            template: "NewDeviceConnection",
            subject: "New device detected"
        });
    }

    return {
        access_token: accessToken,
        refresh_token: refreshToken
    };
});
