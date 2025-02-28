import { z } from "zod";

const bodySchema = z.object({
    name: validation.house.name,
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const body = await readValidatedBody(event, bodySchema.parse);

    const house = await prisma.house.create({
        data: {
            name: body.name,
            ownerId: userId
        },
    });

    return house;
});
