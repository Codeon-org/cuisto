import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id,
});

const bodySchema = z.object({
    name: validation.product.name,
    barcode: validation.product.barcode,
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

    const body = await readValidatedBody(event, bodySchema.parse);
    const safeBarcode = body.barcode?.trim() === "" ? null : body.barcode;

    const product = await prisma.product.create({
        data: {
            name: body.name,
            barcode: safeBarcode,
            houseId: url.houseId,
        },
    });

    return product;
});
