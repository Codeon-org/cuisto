import { Role as PrismaRole } from "@prisma/client";

// Extend Role type with "All" and "None"
export type Role = PrismaRole | "Guest" | "Authenticated" | "None";

export const Roles: Record<Role, Role> = {
    ...PrismaRole,
    Guest: "Guest",
    Authenticated: "Authenticated",
    None: "None",
};

// If the route has no match, it will be available for everyone.
// Only the first match will be used.
export default {
    "/api/ping": [Roles.Guest],
    "/api/auth/**": [Roles.Authenticated],
    "/api/**": [Roles.User],
} as Record<string, Role[]>;
