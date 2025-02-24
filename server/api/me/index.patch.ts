import { z } from "zod";

const schema = z.object({
    username: validation.username.optional(),
    email: validation.email.optional(),
    password: validation.password.optional(),
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const body = await readValidatedBody(event, schema.parse);

    if (body.password)
    {
        body.password = await hash(body.password);
    }

    if (body.email || body.username)
    {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: body.username },
                    { email: body.email },
                ]
            },
        });

        if (existingUser && existingUser.id !== userId)
        {
            throw createError({
                statusCode: 400,
                statusMessage: "Username or email already exists"
            });
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: body,
    });

    return updatedUser;
});
