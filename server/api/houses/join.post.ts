import { DateTime } from "luxon";
import { z } from "zod";

const bodySchema = z.object({
    token: z.string().length(255),
});

export default defineEventHandler(async (event) =>
{
    // Get the user ID from the context
    const { id: userId } = event.context.user;

    // Get the house ID from the request body
    const { token } = await readValidatedBody(event, bodySchema.parse);

    // Get the invitation from the database
    const invitation = await prisma.houseInvitation.findUnique({
        where: {
            token,
        },
        select: {
            id: true,
            expiresAt: true,
            isUsed: true,
            receiver: {
                select: {
                    id: true,
                },
            },
            house: {
                select: {
                    id: true,
                    users: {
                        select: {
                            id: true,
                        },
                    }
                }
            }
        }
    });

    // Check if the invitation exists and is not expired
    if (!invitation || invitation.expiresAt < DateTime.now().toUTC().toJSDate() || invitation.isUsed || invitation.receiver.id !== userId)
    {
        throw createError({
            statusCode: 404,
            statusMessage: "No invitation found",
        });
    }

    // Check if the user is already in the house
    if (invitation.house.users.some(user => user.id === userId))
    {
        throw createError({
            statusCode: 400,
            statusMessage: "User is already in the house",
        });
    }

    // Add the user to the house
    await prisma.house.update({
        where: {
            id: invitation.house.id,
        },
        data: {
            users: {
                connect: {
                    id: userId,
                },
            },
        },
    });

    await prisma.houseInvitation.update({
        where: {
            id: invitation.id
        },
        data: {
            isUsed: true
        }
    });

    return null;
});
