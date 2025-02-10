export default defineEventHandler(async (_event) =>
{
    const users = await prisma.user.findMany();

    return {
        users
    };
});
