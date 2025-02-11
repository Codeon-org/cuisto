import type { H3Event } from "h3";
import type { z } from "zod";

export default async <T extends z.ZodTypeAny>(event: H3Event, schema: T) =>
{
    const body = await readBody(event);
    const result = schema.safeParse(body);

    if (!result.success)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Validation Error",
            data: result.error.issues,
        });
    }

    type resultType = T extends z.ZodObject<infer T> ? T : never;

    return result.data as resultType;
};
