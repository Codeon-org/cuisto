import { DateTime } from "luxon";
import { z } from "zod";

const urlSchema = z.object({
    id: validation.common.id
});

const bodySchema = z.object({
    identifier: z.union([validation.user.username, validation.user.email])
});

export default defineEventHandler(async (event) =>
{
    // Get the user ID from the context
    const { id: userId } = event.context.user;

    // Get the house ID from the path
    const { id: houseId } = await getValidatedRouterParams(event, urlSchema.parse);

    // Get the user email from the request body
    const body = await readValidatedBody(event, bodySchema.parse);

    // Find the house with the given ID
    const house = await prisma.house.findFirst({
        where: {
            id: houseId
        },
        select: {
            ownerId: true,
            name: true,
            users: {
                select: {
                    id: true
                }
            }
        }
    });

    if (!house)
    {
        throw createError({
            statusCode: 404,
            statusMessage: `No house found with id '${houseId}'`
        });
    }

    // Check if the user is the owner of the house
    if (house.ownerId !== userId)
    {
        throw createError({
            statusCode: 403,
            statusMessage: "You are not the owner of this house"
        });
    }

    // Find the user with the given identifier
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: body.identifier },
                { email: body.identifier }
            ]
        }
    });

    if (!user)
    {
        throw createError({
            statusCode: 404,
            statusMessage: `No user found with identifier '${body.identifier}'`
        });
    }

    // Check if the user is already a member of the house
    if (house.users.some(u => u.id === user.id))
    {
        throw createError({
            statusCode: 400,
            statusMessage: "User is already a member of the house"
        });
    }

    // Check if there is already an invitation for the user that is not expired
    const existingInvitation = await prisma.houseInvitation.findFirst({
        where: {
            houseId: houseId,
            receiverId: user.id,
            isUsed: false,
            expiresAt: {
                gte: DateTime.now().toUTC().toJSDate()
            },
        }
    });

    if (existingInvitation)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "An invitation has already been sent to this user"
        });
    }

    // Create an invite for the user with an expiration date
    const token = await generateNanoId("houseInvitation", "token", { length: 255 });
    const invite = await prisma.houseInvitation.create({
        data: {
            houseId: houseId,
            receiverId: user.id,
            authorId: userId,
            token,
            expiresAt: DateTime.now().toUTC().plus({ days: 7 }).toJSDate()
        }
    });

    // Send an email to the user
    await sendMail({
        to: user.email,
        subject: `You have been invited to the house: ${house.name}`,
        text: `You have been invited to the house: ${house.name}. Use the following token to accept the invitation:\n\n${invite.token}\n\nIt will expire in 7 days.`
    });

    // Return a success response with status code "No Content (204)"
    return null;
});
