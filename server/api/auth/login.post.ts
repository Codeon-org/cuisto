import { z } from "zod";

const schema = z.object({
    identifier: z.union([validation.username, validation.email]),
    password: validation.password,
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
            status: 400,
            message: "No user found"
        });
    }

    const passwordValid = await verifyPassword(user.password, body.password);
    if (!passwordValid)
    {
        throw createError({
            status: 400,
            message: "Invalid password"
        });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        access_token: accessToken,
        refresh_token: refreshToken
    };
});
