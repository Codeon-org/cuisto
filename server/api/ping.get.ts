import { DateTime } from "luxon";

export default defineEventHandler(async () =>
{
    // Send SSE to authenticated users
    // broadcast(EventTypes.newUser, "Doe");

    // const res = await $fetch("https://world.openfoodfacts.org/api/v2/product/3038354199603.json");
    // console.log(res);

    // try
    // {
    //     const result = await decodeFromImage(undefined, "/app/.cache/image.jpeg");
    //     return { barcode: result.text };
    // }
    // catch
    // {
    //     return { error: "Barcode not found" };
    // }

    return {
        status: "OK",
        timestamp: DateTime.now().toUTC(),
    };
});
