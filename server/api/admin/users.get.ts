export default defineEventHandler(async (event) =>
{
    const user = await denyAccessUnlessGranted(event);

    logger.info(user);
});
