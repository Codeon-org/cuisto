import { H3Error } from "h3";

export default defineNitroPlugin((nitroApp) =>
{
    nitroApp.hooks.hook("error", async (error, { event }) =>
    {
        event?.node.res.setHeader("Content-Type", "application/json");

        event?.node.res.end(JSON.stringify({
            url: event.node.req.url,
            code: event.node.res.statusCode,
            message: (error instanceof H3Error ? error.statusMessage : error.message) || "An error occured",
            timestamp: new Date().toISOString()
        }));
    });
});
