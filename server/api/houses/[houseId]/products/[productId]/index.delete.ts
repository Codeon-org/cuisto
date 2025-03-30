import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id,
    productId: validation.common.id
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const url = await getValidatedRouterParams(event, urlSchema.parse);

    const house = await prisma.house.findFirst({
        where: {
            AND: [
                { id: url.houseId },
                {
                    OR: [
                        { ownerId: userId },
                        { users: { some: { id: userId } } }
                    ]
                }
            ],
        }
    });

    if (!house)
    {
        throw createError({
            statusCode: 404,
            statusMessage: "House not found"
        });
    }

    // Check if the product exists in the house
    const existingProduct = await prisma.product.findFirst({
        where: {
            id: url.productId,
            houseId: url.houseId,
        },
    });

    if (!existingProduct)
    {
        throw createError({
            statusCode: 404,
            statusMessage: "Product not found",
        });
    }

    // Update the product in the database
    await prisma.product.delete({
        where: {
            id: url.productId,
        },
    });

    return null;
});
