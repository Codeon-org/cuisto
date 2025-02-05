export default defineEventHandler(async (_event) =>
{
    const users = await prisma.user.findMany();

    console.log(users);

    return {
        body: users
    };
});
