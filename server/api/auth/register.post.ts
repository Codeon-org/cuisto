import { z } from "zod";

const schema = z.object({
    username: validation.username,
    email: validation.email,
    password: validation.password,
});

export default defineEventHandler(async (event) =>
{
    const body = await readValidatedBody(event, schema.parse);

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: body.username },
                { email: body.email },
            ]
        },
    });

    if (existingUser)
    {
        throw createError({
            status: 400,
            message: "Username or email already exists"
        });
    }

    const hashedPassword = await hashPassword(body.password);

    const user = await prisma.user.create({
        data: {
            username: body.username,
            email: body.email,
            password: hashedPassword,
            roles: ["User"]
        },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        user: format(user, userSelect),
        tokens: {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    };
});
