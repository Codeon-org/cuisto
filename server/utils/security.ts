import { DateTime } from "luxon";

export const generateTokens = async (user: JwtPayload) =>
{
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken();

    const existingRefreshToken = await prisma.refreshToken.findUnique({
        where: {
            userId: user.id,
        }
    });

    if (existingRefreshToken)
    {
        await prisma.refreshToken.update({
            where: {
                id: existingRefreshToken.id
            },
            data: {
                token: sha512(refreshToken),
                expiresAt: DateTime.now().toUTC().plus({ days: 90 }).toJSDate()
            },
        });
    }
    else
    {
        await prisma.refreshToken.create({
            data: {
                token: sha512(refreshToken),
                userId: user.id,
                expiresAt: DateTime.now().toUTC().plus({ days: 90 }).toJSDate()
            },
        });
    }

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};
