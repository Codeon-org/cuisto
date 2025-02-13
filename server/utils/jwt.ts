import type { Role } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(payload: { id: string; roles: Role[] })
{
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string)
{
    try
    {
        return jwt.verify(token, JWT_SECRET);
    }
    catch
    {
        return null;
    }
}
