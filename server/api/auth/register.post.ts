import argon2 from "argon2";
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
                { email: body.email }
            ]
        }
    });

    if (existingUser)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Username or email already exists"
        });
    }

    const hashedPassword = await argon2.hash(body.password, {
        type: argon2.argon2id, // Recommended variant
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
    });

    const user = await prisma.user.create({
        data: {
            username: body.username,
            email: body.email,
            password: hashedPassword,
            role: "Admin",
        },
        select: {
            id: true
        }
    });

    return { ...user };
});
