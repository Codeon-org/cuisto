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
    const url = await getValidatedRouterParams(event, urlSchema.parse);
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
