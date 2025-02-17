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

    // TODO Bug ici
    const accessToken = generateAccessToken({ id: user.id, roles: user.roles });
    const refreshToken = await generateRefreshToken(user.id);

    return {
        access_token: accessToken,
        refresh_token: refreshToken
    };
});
