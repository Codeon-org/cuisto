export default defineEventHandler(async (_event) =>
{
    return {
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString()
    };
});
