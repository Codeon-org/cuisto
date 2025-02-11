import { z } from "zod";
import getValidatedBody from "~/server/utils/getValidatedBody";

export default defineEventHandler(async (event) =>
{
    const body = await getValidatedBody(event, z.object({
        username: validation.username,
        email: validation.email,
        password: validation.password,
    }));

    return { message: "Validation successful", user: body };
});
