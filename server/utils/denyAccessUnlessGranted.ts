import type { User } from "@prisma/client";
import type { H3Event } from "h3";


export async function denyAccessUnlessGranted(event: H3Event): User {
    const token = getHeader(event, "Authorization")?.split(" ")[1];
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: "You must be authenticated to access this resource" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        throw createError({ statusCode: 401, statusMessage: "Invalid JWT token" });
    }

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: (decoded as any).id
        }
    });
}
