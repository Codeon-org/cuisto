import { DateTime } from "luxon";

export default defineEventHandler(async () =>
{
    return {
        status: "OK",
        timestamp: DateTime.now().toUTC(),
    };
});
