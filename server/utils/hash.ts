import crypto from "crypto";
import argon2 from "argon2";

export const hash = async (payload: Buffer | string) => await argon2.hash(payload, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
});

export const verifyHash = async (hashedPassword: string, payload: Buffer | string) => await argon2.verify(hashedPassword, payload);

export const sha512 = (payload: Buffer | string) => crypto.createHash("sha3-512").update(payload).digest("hex");
