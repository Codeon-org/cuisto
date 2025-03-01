import { Role } from "@prisma/client";
import { DateTime } from "luxon";
import { z } from "zod";

const bodySchema = z.object({
    username: validation.user.username,
    email: validation.user.email,
    password: validation.user.password,
});

export default defineEventHandler(async (event) =>
{
    // Get credentials from the request body
    const body = await readValidatedBody(event, bodySchema.parse);

    // Check if a user already exist with the given email or username
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: body.username },
                { email: body.email },
            ]
        },
    });

    if (existingUser)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Username or email already exists"
        });
    }

    // Create the new user
    const user = await prisma.user.create({
        data: {
            username: body.username,
            email: body.email,
            password: await hash(body.password),
            roles: [Role.User]
        },
    });

    // Generate the tokens (access and refresh)
    const newDeviceToken = await generateNanoId("refreshToken", "deviceToken", { length: 255 });

    const accessToken = generateAccessToken({ id: user.id, roles: user.roles, deviceToken: newDeviceToken });
    const refreshToken = await generateRefreshToken();
    const refreshTokenExpiresAt = DateTime.now().toUTC().plus({ days: 90 }).toJSDate();

    await prisma.refreshToken.create({
        data: {
            token: sha512(refreshToken),
            userId: user.id,
            expiresAt: refreshTokenExpiresAt,
            deviceToken: newDeviceToken
        },
    });

    // Send the tokens to the user
    return {
        access_token: accessToken,
        refresh_token: refreshToken
    };
});
