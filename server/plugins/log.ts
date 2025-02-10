export default defineNitroPlugin((nitroApp) =>
{
    nitroApp.hooks.hook("request", (request) =>
    {
        logger.info(`${request.node.req.method} ${request.node.req.url}`);
    });

    nitroApp.hooks.hook("error", (error) =>
    {
        logger.error(error);
    });

    nitroApp.hooks.hook("close", () =>
    {
        logger.warning("Server closed");
    });
});
