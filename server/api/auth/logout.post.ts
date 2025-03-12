import { DateTime } from "luxon";

export default defineEventHandler(async (event) =>
{
    // Get user from the context
    const { id: userId } = event.context.user;

    // Get device fingerprint from the context
    const { fingerprint } = event.context.device;

    // Delete all refresh tokens associated with the current user and the current device id
    await prisma.refreshToken.updateMany({
        data: {
            expiresAt: DateTime.now().toUTC().toJSDate()
        },
        where: {
            AND: [
                { deviceFingerprint: fingerprint },
                { userId }
            ]
        }
    });

    return null;
});
