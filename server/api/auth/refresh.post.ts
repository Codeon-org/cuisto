import { DateTime } from "luxon";
import { z } from "zod";

const bodySchema = z.object({
    refresh_token: z.string()
});

export default defineEventHandler(async (event) =>
{
    // Get data from the context
    const { id: userId, roles: userRoles } = event.context.user;
    const { fingerprint } = event.context.device;

    // Read the request body
    const body = await readValidatedBody(event, bodySchema.parse);

    const refreshToken = await prisma.refreshToken.findUnique({
        where: {
            deviceFingerprint: fingerprint,
            token: sha512(body.refresh_token),
            userId: userId
        },
        select: {
            id: true,
            expiresAt: true
        }
    });

    if (!refreshToken || refreshToken.expiresAt < DateTime.now().toUTC().toJSDate())
    {
        throw createError({
            statusCode: 403,
            statusMessage: "Invalid refresh token",
        });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken({ id: userId, roles: userRoles });
    const newRefreshToken = await generateRefreshToken();
    const refreshTokenExpiresAt = DateTime.now().toUTC().plus({ days: 90 }).toJSDate();

    await prisma.refreshToken.update({
        where: {
            id: refreshToken.id
        },
        data: {
            token: sha512(newRefreshToken),
            expiresAt: refreshTokenExpiresAt,
        },
    });

    return {
        access_token: accessToken,
        refresh_token: newRefreshToken
    };
});
