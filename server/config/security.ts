import { Role as PrismaRole } from "@prisma/client";

// Extend Role type with "All" and "Deny"
export type Role = PrismaRole | "Guest" | "Authenticated" | "Deny";

export const Roles: Record<Role, Role> = {
    ...PrismaRole,
    Guest: "Guest",
    Authenticated: "Authenticated",
    Deny: "Deny",
};

// If the route has no match, it will be available for everyone.
// Only the first match will be used.
export default {
    "/api/_ws": [Roles.Authenticated],
    "/api/ping": [Roles.Guest],
    "/api/auth/public/**": [Roles.Guest],
    "/api/**": [Roles.Authenticated],
} as Record<string, Role[]>;
