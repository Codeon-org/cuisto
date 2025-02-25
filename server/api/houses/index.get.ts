export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;

    const { take, skip, orderBy } = getPagination(event);

    const houses = await prisma.house.findMany({
        where: {
            OR: [
                { ownerId: userId },
                { users: { some: { id: userId } } }
            ]
        },
        orderBy,
        take,
        skip
    });

    return houses;
});
