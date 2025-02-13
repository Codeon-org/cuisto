export default defineNitroPlugin((nitroApp) =>
{
    nitroApp.hooks.hook("request", (request) =>
    {
        logger.info(`${request.node.req.method} ${request.node.req.url}`);
    });

    nitroApp.hooks.hook("error", async (error, { event }) =>
    {
        logger.error(`(${event?.node.res.statusCode || 500}) ${error.message}`);
    });

    nitroApp.hooks.hook("close", () =>
    {
        logger.warning("Server closed");
    });
});
