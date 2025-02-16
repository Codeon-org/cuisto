import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateAccessToken = (payload: JwtPayload) => generateToken({ id: payload.id, roles: payload.roles });
export const generateRefreshToken = (payload: JwtPayload) => generateToken({ id: payload.id, roles: payload.roles }, "30d");

export const generateToken = (payload: JwtPayload, expiresIn: StringValue | number = "1h") => jwt.sign(payload, JWT_SECRET, { expiresIn });
export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET) as JwtPayload & jwt.JwtPayload;
