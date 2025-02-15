import type { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateAccessToken = (user: User) => generateToken({ id: user.id, roles: user.roles });
export const generateRefreshToken = (user: User) => generateToken({ id: user.id, roles: user.roles }, "30d");

export const generateToken = (payload: JwtPayload, expiresIn: StringValue | number = "1h") => jwt.sign(payload, JWT_SECRET, { expiresIn });
export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET) as JwtPayload & jwt.JwtPayload;
