import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import type { Role } from "@prisma/client";
import { nanoid } from "nanoid";

type JwtPayload = {
    id: string;
    roles: Role[];
    salt: string;
};

const JWT_SECRET = process.env.JWT_SECRET!;

const generateToken = (payload: object, expiresIn: StringValue | number = "1h") => jwt.sign({ ...payload, salt: nanoid() }, JWT_SECRET, { expiresIn });

export const generateAccessToken = (payload: Omit<JwtPayload, "salt">) => generateToken(payload);
export const generateRefreshToken = (payload: Omit<JwtPayload, "salt">) => generateToken(payload, "30d");
export const verifyToken = (token: string) =>
{
    try
    {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    }
    catch
    {
        return null;
    }
};
