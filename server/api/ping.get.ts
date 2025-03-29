import { DateTime } from "luxon";

export default defineEventHandler(async () =>
{
    // Send SSE to authenticated users
    // broadcast(EventTypes.newUser, "Doe");

    // const res = await $fetch("https://world.openfoodfacts.org/api/v2/product/3038354199603.json");
    // console.log(res);

    return {
        status: "OK",
        timestamp: DateTime.now().toUTC(),
    };
});
