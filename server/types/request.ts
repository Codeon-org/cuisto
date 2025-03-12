import type { Role } from "@prisma/client";

export type UserContext = {
    id: string;
    roles: Role[];
};

export type DeviceContext = {
    fingerprint: string;
};

export type JwtContext = {
    accessToken: string;
};

declare module "h3"
{
    interface H3EventContext
    {
        user: UserContext;
        device: DeviceContext;
        jwt: JwtContext;
    }
}
