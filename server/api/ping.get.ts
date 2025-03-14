import { DateTime } from "luxon";

export default defineEventHandler(async () =>
{
    // Send SSE to authenticated users
    broadcast(EventTypes.newUser, "Doe");

    return {
        status: "OK",
        timestamp: DateTime.now().toUTC(),
    };
});
