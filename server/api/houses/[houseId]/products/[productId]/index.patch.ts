import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id,
    productId: validation.common.id
});

const bodySchema = z.object({
    name: validation.product.name.optional(),
    barcode: validation.product.barcode.optional(),
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const url = await getValidatedRouterParams(event, urlSchema.parse);
    const body = await readValidatedBody(event, bodySchema.parse);

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

    // Check if the barcode already exists in the house
    if (body.barcode)
    {
        const existingProduct = await prisma.product.findFirst({
            where: {
                barcode: body.barcode,
                houseId: url.houseId
            },
        });

        if (existingProduct)
        {
            throw createError({
                statusCode: 400,
                statusMessage: "A product with this barcode already exists",
            });
        }
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
        where: {
            id: url.productId,
            houseId: url.houseId,
        },
        data: body,
    });

    return updatedProduct;
});
