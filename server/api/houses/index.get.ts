export default defineEventHandler(async (event) =>
{
    const { id } = event.context.user;

    const houses = await prisma.house.findMany({
        where: {
            users: {
                some: {
                    id: id
                }
            }
        }
    });

    return houses;
});
