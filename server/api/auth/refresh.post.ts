import { z } from "zod";

const schema = z.object({
    refresh_token: z.string()
});

export default defineEventHandler(async (event) =>
{
    const body = await readValidatedBody(event, schema.parse);

    // Verify and decode the JWT
    const decoded = verifyToken(body.refresh_token);
    if (!decoded)
    {
        throw createError({
            statusCode: 403,
            statusMessage: "Invalid refresh token",
        });
    }

    const newAccessToken = generateAccessToken(decoded);
    const newRefreshToken = generateRefreshToken(decoded);

    return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken
    };
});
