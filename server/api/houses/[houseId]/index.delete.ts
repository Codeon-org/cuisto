import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id
});

export default defineEventHandler(async (event) =>
{
    // Get houseId from url
    const url = await getValidatedRouterParams(event, urlSchema.parse);

    // Get the userId from the event context
    const { id: userId } = event.context.user;

    // Check if the house exists
    const house = await prisma.house.findFirst({
        where: {
            id: url.houseId,
            ownerId: userId,
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

    // Delete the house
    await prisma.house.delete({
        where: {
            id: url.houseId,
        },
    });

    return null;
});
