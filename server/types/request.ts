import type { Role } from "@prisma/client";

export type UserContext = {
    id: string;
    roles: Role[];
};

declare module "h3"
{
    interface H3EventContext
    {
        user: UserContext;
    }
}
