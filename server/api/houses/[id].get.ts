import { z } from "zod";

const urlSchema = z.object({
    id: validation.common.id
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const body = await getValidatedRouterParams(event, urlSchema.parse);

    if (!body.id)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing 'id' url parameter"
        });
    }

    const house = await prisma.house.findFirst({
        where: {
            AND: [
                { id: body.id },
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
            statusMessage: `No house found with id '${body.id}'`
        });
    }

    return house;
});
