import { z } from "zod";

const bodySchema = z.object({
    username: validation.user.username.optional(),
    email: validation.user.email.optional(),
    password: validation.user.password.optional(),
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const body = await readValidatedBody(event, bodySchema.parse);

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
                ],
                NOT: [
                    { id: userId }
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
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: body,
    });

    return updatedUser;
});
