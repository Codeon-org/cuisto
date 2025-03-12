export default defineEventHandler(async (event) =>
{
    // Get user from the context
    const { id: userId } = event.context.user;

    // Get device token from the context
    // const { token: deviceToken } = event.context.device;

    // Delete all refresh tokens associated with the current user and the current device id
    await prisma.refreshToken.deleteMany({
        where: {
            AND: [
                { deviceToken },
                { userId }
            ]
        }
    });

    return null;
});
