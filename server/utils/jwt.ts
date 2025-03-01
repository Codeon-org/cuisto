import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { nanoid } from "nanoid";

const JWT_SECRET = process.env.JWT_SECRET;

export const generateAccessToken = (payload: JwtPayload, ttl: StringValue | number = "1h") =>
{
    return jwt.sign(
        { id: payload.id, roles: payload.roles, deviceToken: payload.deviceToken } as JwtPayload,
        JWT_SECRET,
        {
            algorithm: "HS512",
            expiresIn: ttl,
            subject: "Authentication JWT token",
        });
};

export const generateRefreshToken = async () =>
{
    let existingToken;
    let token;

    do
    {
        token = nanoid(255);

        existingToken = await prisma.refreshToken.findFirst({
            where: {
                token: sha512(token)
            }
        });
    } while (existingToken !== null);

    return token;
};

export const verifyJwtToken = (token: string) =>
{
    try
    {
        return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtPayload;
    }
    catch
    {
        return null;
    }
};
