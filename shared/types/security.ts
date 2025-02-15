import type { Role } from "@prisma/client";

export type JwtPayload = {
    id: string;
    roles: Role[];
};

export type JwtTokens = {
    accessToken: string;
    refreshToken: string;
};
