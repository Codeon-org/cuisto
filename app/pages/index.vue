<template>
    <div>
        <ULink to="/test">
            Test
        </ULink>
        <p>{{ code }}</p>
        <pre>{{ err }}</pre>
        <br>
        <StreamBarcodeReader
            @decode="onDecode"
            @error="onError"
        />
    </div>
</template>

<script setup lang="ts">
import { StreamBarcodeReader } from "vue-barcode-reader";

const code = ref("");
const err = ref("");

const onDecode = (res: string) =>
{
    code.value = res;
};

const onError = (res: string) =>
{
    err.value = res;
};

// useSocket({
//     newUser: (name) =>
//     {
//         console.log(name);
//     }
// });
</script>
