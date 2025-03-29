<template>
    <div>
        <video ref="video" />
        <canvas
            ref="canvas"
            class="hidden"
        />
        <p>{{ support }}</p>
    </div>
</template>

<script>
export default {
    data()
    {
        return {
            detector: null,
            decodedValue: "",
            support: ""
        };
    },
    mounted()
    {
        if (!supportBarcodeApi())
        {
            this.support = "Barcode Detector is not supported by this browser.";
        }
        else
        {
            this.support = "Barcode Detector supported!";

            // create new detector
            // const barcodeDetector = new BarcodeDetector({
            //     formats: ["code_39", "codabar", "ean_13"],
            // });
        }

        // Get access to the video element
        this.video = this.$refs.video;
        // Check if BarcodeDetector exists or load polyfill if needed.
        if (!window.BarcodeDetector)
        {
            console.warn("BarcodeDetector API not supported. Consider loading a polyfill.");
        // Optionally load a polyfill here.
        }
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "front" } })
            .then((stream) =>
            {
                this.video.srcObject = stream;
                this.video.play();
                this.startScanning();
            })
            .catch((error) =>
            {
                console.error("Error accessing camera", error);
            });
    },
    methods: {
        async startScanning()
        {
            this.detector = new BarcodeDetector({ formats: ["qr_code", "ean_13"] });
            this.scanLoop();
        },
        async scanLoop()
        {
            if (!this.video.videoWidth)
            {
                requestAnimationFrame(this.scanLoop);
                return;
            }
            const canvas = this.$refs.canvas;
            const context = canvas.getContext("2d");
            canvas.width = this.video.videoWidth;
            canvas.height = this.video.videoHeight;
            context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

            try
            {
                const barcodes = await this.detector.detect(canvas);
                if (barcodes.length > 0)
                {
                    console.log("Detected code:", barcodes[0].rawValue);
                    this.decodedValue = barcodes[0].rawValue;
                    // You might stop scanning here if you want:
                    // return;
                }
            }
            catch (error)
            {
                console.error("Detection error:", error);
            }
            requestAnimationFrame(this.scanLoop);
        }
    }
};
</script>
