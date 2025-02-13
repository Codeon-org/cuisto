export default defineEventHandler(async (event) =>
{
    logger.info(event.context.auth.id);
});
