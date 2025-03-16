import { DateTime } from "luxon";
import Quagga from "@ericblade/quagga2"; // ES6
import { decodeFromImage } from "@zxing/library";

export default defineEventHandler(async () =>
{
    // Send SSE to authenticated users
    // broadcast(EventTypes.newUser, "Doe");

    // const res = await $fetch("https://world.openfoodfacts.org/api/v2/product/3038354199603.json");
    // console.log(res);

    // Quagga.decodeSingle(
    //     {
    //         src: "/app/.cache/image.jpeg",
    //         numOfWorkers: 0, // Needs to be 0 when used within node
    //         decoder: {
    //             readers: ["code_128_reader"] // List of active readers
    //         },
    //     },
    //     (result) =>
    //     {
    //         if (result?.codeResult)
    //         {
    //             console.log(result.codeResult.code);
    //         }
    //         else
    //         {
    //             console.log("No barcode detected");
    //         }
    //     }
    // );

    try
    {
        const result = await decodeFromImage(undefined, "/app/.cache/image.jpeg");
        return { barcode: result.text };
    }
    catch
    {
        return { error: "Barcode not found" };
    }

    return {
        status: "OK",
        timestamp: DateTime.now().toUTC(),
    };
});
