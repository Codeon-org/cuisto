export default defineEventHandler(async (event) =>
{
    setResponseHeader(event, "Content-Type", "text/event-stream");
    setResponseHeader(event, "Cache-Control", "no-cache");
    setResponseHeader(event, "Connection", "keep-alive");

    const stream = event.node.res;
    stream.flushHeaders();

    addConnection(stream);

    stream.on("close", () =>
    {
        removeConnection(stream);
    });
});
