import { minimatch } from "minimatch";
import type { Role } from "../config/security";
import routeRules, { Roles } from "../config/security";

export const getRouteRequiredRoles = (path: string): Role[] =>
{
    for (const [pattern, roles] of Object.entries(routeRules))
    {
        if (minimatch(path, pattern))
        {
            return roles.length > 0 ? roles : [Roles.Guest]; // If empty, return [Roles.Guest]
        }
    }
    return [Roles.Guest]; // No match found, return default role
};
