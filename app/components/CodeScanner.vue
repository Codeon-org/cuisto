<!-- <template>
    <div>
        <video
            ref="video"
            muted
            autoplay
            playsinline
            webkit-playsinline
        />
        <canvas
            ref="canvas"
            class="hidden"
        />
    </div>
</template>

<script setup lang="ts">
import { BarcodeDetector as BarcodeDetectorPonyfill } from "barcode-detector/ponyfill";
import { useDevicesList } from "@vueuse/core";

const video = ref<HTMLVideoElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const intervalId: NodeJS.Timeout | null = null;

const { videoInputs } = useDevicesList({
    requestPermissions: true,
});

onMounted(async () =>
{
    // const stream = await navigator.mediaDevices.getUserMedia({
    //     video: {
    //         facingMode: { ideal: "environment" }
    //     },
    //     audio: false
    // });

    // try
    // {
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //         video: {
    //             facingMode: { ideal: "environment" },
    //             deviceId: videoInputs.value[3]?.deviceId
    //         },
    //         audio: false
    //     });

    //     if (video.value && canvas.value)
    //     {
    //         video.value.srcObject = stream;
    //         await video.value.play();

    //         canvas.value.width = video.value.videoWidth;
    //         canvas.value.height = video.value.videoHeight;

    //         const barcodeDetector = new BarcodeDetectorPonyfill({
    //             formats: ["ean_13", "ean_8"],
    //         });

    //         intervalId = setInterval(async () =>
    //         {
    //             if (!video.value || !canvas.value) return;

    //             const ctx = canvas.value.getContext("2d");
    //             // Draw the current video frame onto the canvas
    //             ctx?.drawImage(
    //                 video.value,
    //                 0,
    //                 0,
    //                 canvas.value.width,
    //                 canvas.value.height
    //             );

    //             // Run the barcode detection on the canvas
    //             const barcodes = await barcodeDetector.detect(canvas.value);
    //             if (barcodes && barcodes.length > 0)
    //             {
    //                 // For demonstration, log the detected QR code values
    //                 alert("Detected QR code(s): " + barcodes.map(b => b.rawValue).join(", "));
    //             }
    //         }, 250);
    //     }
    // }
    // catch (error)
    // {
    //     console.error("Error accessing media devices.", error);
    // }
});

onUnmounted(() =>
{
    if (intervalId)
    {
        clearInterval(intervalId);
    }
});
</script> -->

<template>
    <div>
        <label for="cameraSelect">Choose a camera:</label>
        <select
            id="cameraSelect"
            v-model="selectedDeviceId"
            @change="startCamera"
        >
            <option
                v-for="device in videoInputs"
                :key="device.deviceId"
                :value="device.deviceId"
            >
                {{ device.label || `Camera ${device.deviceId}` }}
            </option>
        </select>
        <video
            ref="videoRef"
            autoplay
            playsinline
            style="width: 100%; max-width: 600px; margin-top: 1rem;"
        />
        <!-- Hidden canvas for processing video frames -->
        <canvas
            ref="canvasRef"
            style="display: none;"
        />
    </div>
</template>

<script setup>
import { BarcodeDetector as BarcodeDetectorPonyfill } from "barcode-detector/ponyfill";

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const selectedDeviceId = ref<string>("");

// Get devices from VueUse
const { videoInputs, ensurePermissions, permissionGranted } = useDevicesList();

let detectionInterval = null;

async function startCamera()
{
    // Stop any existing stream
    if (videoRef.value?.srcObject)
    {
        videoRef.value.srcObject.getTracks().forEach(track => track.stop());
    }

    if (!selectedDeviceId.value) return;

    try
    {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedDeviceId.value } },
            audio: false
        });
        videoRef.value.srcObject = stream;
        await videoRef.value.play();

        // Set canvas dimensions to match the video once metadata is available
        videoRef.value.addEventListener("loadedmetadata", () =>
        {
            if (canvasRef.value)
            {
                canvasRef.value.width = videoRef.value.videoWidth;
                canvasRef.value.height = videoRef.value.videoHeight;
            }
        });
    }
    catch (error)
    {
        console.error("Error starting camera:", error);
    }
}

function startBarcodeDetection()
{
    if (detectionInterval) clearInterval(detectionInterval);

    // Configure BarcodeDetector to detect QR codes and other common barcode formats
    const barcodeDetector = new BarcodeDetectorPonyfill({
        formats: ["qr_code", "ean_13", "code_128"]
    });

    detectionInterval = setInterval(async () =>
    {
        if (!videoRef.value || !canvasRef.value) return;
        const ctx = canvasRef.value.getContext("2d");
        ctx.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height);
        try
        {
            const barcodes = await barcodeDetector.detect(canvasRef.value);
            if (barcodes.length > 0)
            {
                console.log("Detected barcodes:", barcodes.map(b => b.rawValue));
            }
        }
        catch (error)
        {
            console.error("Barcode detection error:", error);
        }
    }, 250);
}

onMounted(async () =>
{
    // Request permissions for accessing media devices
    await ensurePermissions();
    if (permissionGranted.value)
    {
        // If available, select the first camera by default
        if (videoInputs.value.length > 0 && !selectedDeviceId.value)
        {
            selectedDeviceId.value = videoInputs.value[0].deviceId;
            await startCamera();
            startBarcodeDetection();
        }
    }
    else
    {
        console.error("Camera permissions not granted.");
    }
});

onUnmounted(() =>
{
    if (detectionInterval) clearInterval(detectionInterval);
    if (videoRef.value?.srcObject)
    {
        videoRef.value.srcObject.getTracks().forEach(track => track.stop());
    }
});

// Watch for changes in the selected device and restart the camera if needed
watch(selectedDeviceId, async (newDeviceId, oldDeviceId) =>
{
    if (newDeviceId !== oldDeviceId)
    {
        await startCamera();
    }
});
</script>
