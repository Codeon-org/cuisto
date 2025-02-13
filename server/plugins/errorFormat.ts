export default defineNitroPlugin((nitroApp) =>
{
    nitroApp.hooks.hook("error", async (error, { event }) =>
    {
        event?.node.res.setHeader("Content-Type", "application/json");

        event?.node.res.end(JSON.stringify({
            url: event.node.req.url,
            code: event.node.res.statusCode,
            message: error.message || "Internal Server Error",
            timestamp: new Date().toISOString()
        }));
    });
});
