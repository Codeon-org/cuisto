import { DateTime } from "luxon";

export const generateTokens = async (user: Omit<JwtPayload, "deviceToken">, deviceToken?: string) =>
{
    const newDeviceToken = deviceToken ?? await generateNanoId("refreshToken", "deviceToken", { length: 255 });

    const accessToken = generateAccessToken({ id: user.id, roles: user.roles, deviceToken: newDeviceToken });
    const refreshToken = await generateRefreshToken();
    const refreshTokenExpiresAt = DateTime.now().toUTC().plus({ days: 90 }).toJSDate();

    // Get existing refresh token
    const existingRefreshToken = await prisma.refreshToken.findUnique({
        where: {
            deviceToken: newDeviceToken,
        }
    });

    // if (existingRefreshToken)
    // {
    //     await prisma.refreshToken.update({
    //         where: {
    //             id: existingRefreshToken.id
    //         },
    //         data: {
    //             token: sha512(refreshToken),
    //             expiresAt: refreshTokenExpiresAt
    //         },
    //     });
    // }
    // else
    // {
    //     await prisma.refreshToken.create({
    //         data: {
    //             token: sha512(refreshToken),
    //             userId: user.id,
    //             expiresAt: refreshTokenExpiresAt
    //         },
    //     });
    // }

    // return {
    //     accessToken: accessToken,
    //     refreshToken: refreshToken
    // };
};
