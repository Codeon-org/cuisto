export default defineEventHandler(async (event) =>
{
    const token = getHeader(event, "Authorization")?.split(" ")[1];

    if (!token)
    {
        throw createError({ statusCode: 401, statusMessage: "You must be authenticated to access this resource" });
    }

    const decoded = verifyToken(token);
    if (!decoded)
    {
        throw createError({ statusCode: 401, statusMessage: "Invalid JWT token" });
    }

    // Attach user data to the request
    event.context.auth = decoded;
});
