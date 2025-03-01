import type { VerifyOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

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
    return await generateNanoId("refreshToken", "token", { length: 255 }, rawValue => sha512(rawValue));
};

export const readVerifiedJwtToken = (token: string, options?: VerifyOptions) =>
{
    try
    {
        return jwt.verify(token, JWT_SECRET, options) as jwt.JwtPayload & JwtPayload;
    }
    catch
    {
        return null;
    }
};
