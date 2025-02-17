import { DateTime } from "luxon";

export default defineEventHandler(async (_event) =>
{
    return {
        status: "OK",
        timestamp: DateTime.now().toUTC(),
    };
});
