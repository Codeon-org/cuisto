import { DateTime } from "luxon";
import { z } from "zod";

const schema = z.object({
    refresh_token: z.string()
});

export default defineEventHandler(async (event) =>
{
    const body = await readValidatedBody(event, schema.parse);

    const refreshToken = await prisma.refreshToken.findUnique({
        where: {
            token: sha512(body.refresh_token),
        },
        select: {
            expiresAt: true,
            user: {
                select: {
                    id: true,
                    roles: true,
                }
            }
        }
    });

    if (!refreshToken || refreshToken.expiresAt < DateTime.now().toUTC().toJSDate())
    {
        throw createError({
            statusCode: 403,
            statusMessage: "Invalid refresh token",
        });
    }

    const tokens = await generateTokens(refreshToken.user);

    return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
    };
});
