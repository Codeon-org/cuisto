import type { Role } from "@prisma/client";

export type JwtPayload = {
    id: string;
    roles: Role[];
    deviceToken: string;
};
