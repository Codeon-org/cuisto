export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const houseId = getRouterParam(event, "id");

    if (!houseId)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing 'id' url parameter"
        });
    }

    const house = await prisma.house.findFirst({
        where: {
            AND: [
                { id: houseId },
                { users: { some: { id: userId } } }
            ]
        }
    });

    if (!house)
    {
        throw createError({
            statusCode: 404,
            statusMessage: `No house found with id '${houseId}'`
        });
    }

    return house;
});
