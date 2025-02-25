import { z } from "zod";

const schema = z.object({
    identifier: z.union([validation.user.username, validation.user.email]),
    password: validation.user.password,
});

export default defineEventHandler(async (event) =>
{
    const body = await readValidatedBody(event, schema.parse);

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

    const passwordValid = await verifyHash(user.password, body.password);
    if (!passwordValid)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid password"
        });
    }

    const tokens = await generateTokens(user);

    return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
    };
});
