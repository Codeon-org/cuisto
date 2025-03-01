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
            roles: true
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
    const newDeviceToken = await generateNanoId("refreshToken", "deviceToken", { length: 255 });

    const accessToken = generateAccessToken({ id: user.id, roles: user.roles, deviceToken: newDeviceToken });
    const refreshToken = await generateRefreshToken();
    const refreshTokenExpiresAt = DateTime.now().toUTC().plus({ days: 90 }).toJSDate();

    await prisma.refreshToken.create({
        data: {
            token: sha512(refreshToken),
            userId: user.id,
            expiresAt: refreshTokenExpiresAt,
            deviceToken: newDeviceToken
        },
    });

    return {
        access_token: accessToken,
        refresh_token: refreshToken
    };
});
