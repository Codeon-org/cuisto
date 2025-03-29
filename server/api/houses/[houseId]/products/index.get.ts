import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id
});

export default defineEventHandler(async (event) =>
{
    const url = await getValidatedRouterParams(event, urlSchema.parse);
    const { take, skip, orderBy } = getPagination(event);

    const products = await prisma.product.findMany({
        where: {
            houseId: url.houseId
        },
        orderBy,
        take,
        skip
    });

    return products;
});
