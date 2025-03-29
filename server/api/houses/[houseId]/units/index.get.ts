import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id,
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const url = await getValidatedRouterParams(event, urlSchema.parse);
    const { take, skip, orderBy } = getPagination(event);

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

    const units = await prisma.unit.findMany({
        where: {
            houseId: url.houseId,
        },
        orderBy,
        take,
        skip
    });

    return units;
});
