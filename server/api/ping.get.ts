import { DateTime } from "luxon";

export default defineEventHandler(() =>
{
    return {
        status: "OK",
        timestamp: DateTime.now().toUTC(),
    };
});
