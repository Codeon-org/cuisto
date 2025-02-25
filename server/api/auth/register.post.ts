import { Role } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
    username: validation.user.username,
    email: validation.user.email,
    password: validation.user.password,
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
            statusCode: 400,
            statusMessage: "Username or email already exists"
        });
    }

    const user = await prisma.user.create({
        data: {
            username: body.username,
            email: body.email,
            password: await hash(body.password),
            roles: [Role.User]
        },
    });

    const tokens = await generateTokens(user);

    return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
    };
});
