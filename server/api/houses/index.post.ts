import { z } from "zod";

const schema = z.object({
    name: validation.house.name,
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const body = await readValidatedBody(event, schema.parse);

    const house = await prisma.house.create({
        data: {
            name: body.name,
            ownerId: userId
        },
    });

    return house;
});
