export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;

    await prisma.user.delete({
        where: {
            id: userId
        },
    });

    return null;
});
