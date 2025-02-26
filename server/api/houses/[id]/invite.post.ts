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

    // Create an invite for the user with an expiration date
    const invite = await prisma.houseInvitation.create({
        data: {
            houseId: houseId,
            email: user.email,
            token: generateToken(),
            expiresAt: DateTime.now().toUTC().plus({ days: 7 }).toJSDate()
        }
    });

    // Send an email to the user
    await sendEmail({
        to: user.email,
        subject: "You have been invited to a house",
        text: `You have been invited to a house. Click the following link to join: ${invite.token}`
    });

    // Return a success response with status code "No Content (204)"
    return null;
});
