import { H3Error } from "h3";

export default defineNitroPlugin((nitroApp) =>
{
    logger.info("Server started");

    nitroApp.hooks.hook("request", (request) =>
    {
        logger.info(`${request.node.req.method} ${request.node.req.url}`);
    });

    nitroApp.hooks.hook("error", async (error, { event }) =>
    {
        // logger.error(`(${event?.node.res.statusCode || 500}) ${(error instanceof H3Error ? error.statusMessage : error.message) || "An error occured"}`);
        logger.error(`(${event?.node.res.statusCode || 500}) ${(error instanceof H3Error ? error.statusMessage : error.message) || error}`);
    });

    nitroApp.hooks.hook("close", () =>
    {
        logger.warning("Server closed");
    });
});
