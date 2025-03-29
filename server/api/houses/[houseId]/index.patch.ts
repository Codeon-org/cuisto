import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id
});

const bodySchema = z.object({
    name: validation.house.name.optional(),
});

export default defineEventHandler(async (event) =>
{
    // Get houseId from url
    const url = await getValidatedRouterParams(event, urlSchema.parse);

    // Get the userId from the event context
    const { id: userId } = event.context.user;

    // Get the body from the event
    const body = await readValidatedBody(event, bodySchema.parse);

    // Check if the house exists
    const house = await prisma.house.findFirst({
        where: {
            AND: [
                { id: url.houseId },
                { ownerId: userId },
            ],
        }
    });

    // If the house doesn't exist, throw a 404 error
    if (!house)
    {
        throw createError({
            statusCode: 404,
            statusMessage: "House not found",
        });
    }

    // Update the house
    const updatedHouse = await prisma.house.update({
        where: {
            id: url.houseId,
        },
        data: body,
    });

    return updatedHouse;
});
