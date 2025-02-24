export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
    });

    return user;
});
