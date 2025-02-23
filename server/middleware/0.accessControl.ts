export default defineEventHandler(async (event) =>
{
    const url = getRequestURL(event).pathname;

    // Get the required roles for this route
    const requiredRoles = getRouteRequiredRoles(url);

    // If no restriction exists, allow access
    if (requiredRoles.includes(Roles.Guest))
    {
        return;
    }

    // If route is fully restricted (Roles.None), deny access
    if (requiredRoles.includes(Roles.None))
    {
        throw createError({
            statusCode: 403,
            statusMessage: "Restricted Route"
        });
    }

    // Retrieve the JWT token from cookies or headers
    const token = getHeader(event, "Authorization")?.replace("Bearer ", "");
    if (!token)
    {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    // Verify and decode the JWT
    const decoded = verifyJwtToken(token);
    if (!decoded)
    {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid Token",
        });
    }

    if (requiredRoles.includes(Roles.Authenticated))
    {
        return;
    }

    // Extract the user's roles
    const userRoles = decoded.roles || [];

    // Deny access if the user lacks at least one required role
    if (!userRoles.some(role => requiredRoles.includes(role)))
    {
        throw createError({
            statusCode: 403,
            statusMessage: "Insufficient Permissions",
        });
    }
});
