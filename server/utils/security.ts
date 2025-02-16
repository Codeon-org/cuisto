import type { H3Event } from "h3";

export async function denyAccessUnlessGranted(event: H3Event)
{
    const token = getHeader(event, "Authorization")?.split(" ")[1];
    if (!token)
    {
        throw createError({
            statusCode: 401,
            statusMessage: "You must be authenticated to access this resource"
        });
    }

    try
    {
        const decoded = verifyToken(token);

        const user = await prisma.user.findUniqueOrThrow({
            where: {

                id: decoded.id
            }
        });

        return user;
    }
    catch
    {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid JWT token"
        });
    }
}
