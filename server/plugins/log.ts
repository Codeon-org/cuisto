import type { H3Error } from "h3";
import type { ErrorEvent, CaptureError } from "nitropack";

export default defineNitroPlugin((nitroApp) =>
{
    nitroApp.hooks.hook("request", (request) =>
    {
        logger.info(`${request.node.req.method} ${request.node.req.url}`);
    });

    nitroApp.hooks.hook("error", async (error) =>
    {
        logger.error(error.message);
    });

    nitroApp.hooks.hook("close", () =>
    {
        logger.warning("Server closed");
    });
});
