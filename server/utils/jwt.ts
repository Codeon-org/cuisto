import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import type { Role } from "@prisma/client";
import { nanoid } from "nanoid";

type JwtPayload = {
    id: string;
    roles: Role[];
};

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_ISSUER = process.env.JWT_ISSUER!;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE!;

export const generateAccessToken = (payload: JwtPayload, ttl: StringValue | number = "1h") =>
{
    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            algorithm: "HS512",
            expiresIn: ttl,
            subject: "Authentication JWT token",
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
            jwtid: nanoid(),
        });
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
