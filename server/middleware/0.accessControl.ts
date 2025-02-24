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
    const JWT_ISSUER = process.env.JWT_ISSUER!;
    const JWT_AUDIENCE = process.env.JWT_AUDIENCE!;

    if (!decoded || decoded.aud !== JWT_AUDIENCE || decoded.iss !== JWT_ISSUER)
    {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid Token",
        });
    }

    event.context.user = {
        id: decoded.id,
        roles: decoded.roles
    };

    if (requiredRoles.includes(Roles.Authenticated))
    {
        return;
    }

    const userRoles = decoded.roles || [];
    if (!userRoles.some(role => requiredRoles.includes(role)))
    {
        throw createError({
            statusCode: 403,
            statusMessage: "Insufficient Permissions",
        });
    }
});
