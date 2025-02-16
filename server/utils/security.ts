import type { H3Event } from "h3";

export async function denyAccessUnlessGranted(event: H3Event)
{
    const token = getHeader(event, "Authorization")?.split(" ")[1];
    if (!token)
    {
        throw createError({
            status: 401,
            message: "You must be authenticated to access this resource"
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
            status: 401,
            message: "Invalid JWT token"
        });
    }
}
