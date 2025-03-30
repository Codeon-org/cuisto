import type { H3Event } from "h3";

export const denyAccessUnlessGranted = async (event: H3Event, voter: IVoter, subject: string, attribute: string, options?: AccessDeniedOptions) =>
{
    const { id: userId } = event.context.user;
    if (!userId)
    {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized"
        });
    }

    if (!voter.satisfies(subject, attribute, userId))
    {
        throw createError({
            statusCode: options?.statusCode ?? 403,
            statusMessage: options?.statusMessage ?? "Access Denied"
        });
    }
};
