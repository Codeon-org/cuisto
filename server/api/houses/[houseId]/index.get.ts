import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const url = await getValidatedRouterParams(event, urlSchema.parse);

    if (!url.houseId)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing 'id' url parameter"
        });
    }

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
            statusMessage: `No house found with id '${url.houseId}'`
        });
    }

    return house;
});
