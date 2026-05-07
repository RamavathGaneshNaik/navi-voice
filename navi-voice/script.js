// Get DOM elements
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const statusDisplay = document.getElementById('status');
const lastSpokenDisplay = document.getElementById('last-spoken');
const contextButtons = document.querySelectorAll('.context-btn');
const containerBorder = document.getElementById('container-border');

let model = null;
let lastSpokenObject = null;
let lastSpokenTime = 0;
const throttleDelay = 3000; // 3 seconds delay before repeating an object

// --- 1. Load Model and Webcam ---
async function loadModelAndWebcam() {
    try {
        // Load the COCO-SSD model
        console.log("Loading COCO-SSD model...");
        model = await cocoSsd.load();
        console.log("Model loaded.");

        // Get webcam access
        console.log("Accessing webcam...");
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: false
        });
        video.srcObject = stream;
        console.log("Webcam accessed.");

        // Wait for the video to start playing
        video.addEventListener('loadeddata', () => {
            console.log("Video data loaded.");
            // Set canvas dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Hide status and start detection
            statusDisplay.style.display = 'none';
            console.log("Starting detection loop...");
            detectFrame();
        });

    } catch (error) {
        console.error("Failed to load model or webcam:", error);
        statusDisplay.innerHTML = `<p class="text-red-500 text-center">Error: Could not start model or webcam. <br> Please check permissions.</p>`;
    }
}

// --- 2. Main Detection Loop ---
async function detectFrame() {
    if (!model) return;

    // Run detection
    const predictions = await model.detect(video);

    // Get canvas context to draw on
    const ctx = canvas.getContext('2d');
    // Clear previous drawings
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Draw the current video frame onto the canvas
    ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw bounding boxes and process feedback
    if (predictions.length > 0) {
        drawBoundingBoxes(predictions, ctx);
        processDetections(predictions);
    }

    // Loop
    requestAnimationFrame(detectFrame);
}

// --- 3. Draw Bounding Boxes ---
function drawBoundingBoxes(predictions, ctx) {
    ctx.font = '16px Arial';
    ctx.textBaseline = 'top';

    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        
        // Draw the bounding box
        ctx.strokeStyle = '#22c55e'; // green-500
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw the label background
        ctx.fillStyle = '#22c55e';
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = 16;
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

        // Draw the label text
        ctx.fillStyle = '#000000'; // black
        ctx.fillText(prediction.class, x + 2, y + 2);
    });
}

// --- 4. Feedback Engine ---
function processDetections(predictions) {
    // Find the most confident prediction (as a simple priority)
    let bestPrediction = null;
    let maxScore = 0;

    predictions.forEach(p => {
        if (p.score > 0.6 && p.score > maxScore) {
            maxScore = p.score;
            bestPrediction = p;
        }
    });

    if (bestPrediction) {
        const currentTime = Date.now();
        // Check if we should speak
        // Throttle: Only speak if it's a new object OR if 3 seconds have passed
        if (bestPrediction.class !== lastSpokenObject || (currentTime - lastSpokenTime) > throttleDelay) {
            
            // Simple distance heuristic (from paper concept)
            const boxHeight = bestPrediction.bbox[3];
            let distance = "unknown distance";
            if (boxHeight > 200) distance = "very near";
            else if (boxHeight > 100) distance = "near";
            else distance = "far";

            // Simple direction heuristic
            const boxCenter = bestPrediction.bbox[0] + bestPrediction.bbox[2] / 2;
            let direction = "front";
            if (boxCenter < canvas.width / 3) direction = "on your left";
            else if (boxCenter > (canvas.width / 3) * 2) direction = "on your right";

            const alertText = `${bestPrediction.class}, ${direction}, ${distance}.`;
            
            speakAlert(alertText);
            
            // Update UI and throttle state
            lastSpokenDisplay.textContent = alertText;
            lastSpokenObject = bestPrediction.class;
            lastSpokenTime = currentTime;
        }
    }
}

// --- 5. Speak Alert (TTS) ---
function speakAlert(text) {
    if (!window.speechSynthesis) {
        console.warn("Browser does not support Speech Synthesis.");
        return;
    }
    // Stop any previous speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.1; // Slightly faster
    
    window.speechSynthesis.speak(utterance);
}

// --- 6. Handle Context Switching (Simulation) ---
contextButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all
        contextButtons.forEach(btn => btn.classList.remove('active-context', 'bg-blue-600', 'bg-gray-700'));
        
        // Add base styles
        contextButtons.forEach(btn => btn.classList.add('bg-gray-700'));

        // Add active class to clicked button
        button.classList.add('active-context');
        
        // Update border color to match paper's idea
        let borderColor = 'border-gray-700';
        if(button.id === 'btn-outdoor') borderColor = 'border-blue-500';
        if(button.id === 'btn-indoor') borderColor = 'border-yellow-500';
        if(button.id === 'btn-identify') borderColor = 'border-purple-500';
        containerBorder.className = `video-container w-full max-w-2xl bg-gray-800 rounded-lg shadow-inner overflow-hidden border-4 ${borderColor}`;

        // In a real app, this is where you would call:
        // model.dispose();
        // model = await tf.loadGraphModel('path/to/new_model.json');
        console.log(`Context switched to: ${button.textContent.trim()}`);
        lastSpokenDisplay.textContent = `Switched to ${button.textContent.trim()} mode.`;
        speakAlert(`Switched to ${button.textContent.trim()} mode.`);
        lastSpokenObject = null; // Reset throttle
    });
});

// --- Start the app ---
loadModelAndWebcam();
