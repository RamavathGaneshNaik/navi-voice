const img = document.getElementById('ipcam');
const canvas = document.getElementById('canvas');
const statusDisplay = document.getElementById('status');
const lastSpokenDisplay = document.getElementById('last-spoken');
const contextButtons = document.querySelectorAll('.context-btn');
const containerBorder = document.getElementById('container-border');

let model = null;
let lastSpokenObject = null;
let lastSpokenTime = 0;
const throttleDelay = 3000;

// ✅ Use your IP Webcam address here
const IP_CAM_URL = "http://192.0.0.4:8080/shot.jpg";

async function loadModel() {
  try {
    model = await cocoSsd.load();
    statusDisplay.style.display = 'none';
    detectLoop();
  } catch (e) {
    statusDisplay.innerHTML = `<p class="text-red-500">Error loading model.</p>`;
  }
}

async function detectLoop() {
  img.src = `${IP_CAM_URL}?t=${new Date().getTime()}`;
  img.onload = async () => {
    if (!model) return;
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    const predictions = await model.detect(img);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (predictions.length > 0) {
      drawBoxes(predictions, ctx);
      processDetections(predictions);
    }

    requestAnimationFrame(detectLoop);
  };
}

function drawBoxes(predictions, ctx) {
  ctx.font = '16px Arial';
  predictions.forEach(p => {
    const [x, y, w, h] = p.bbox;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#22c55e';
    const tw = ctx.measureText(p.class).width;
    ctx.fillRect(x, y, tw + 4, 20);
    ctx.fillStyle = '#000';
    ctx.fillText(p.class, x + 2, y + 2);
  });
}

function processDetections(predictions) {
  let best = null, max = 0;
  predictions.forEach(p => { if (p.score > 0.6 && p.score > max) { max = p.score; best = p; } });
  if (!best) return;

  const now = Date.now();
  if (best.class !== lastSpokenObject || now - lastSpokenTime > throttleDelay) {
    const h = best.bbox[3];
    let distance = h > 200 ? "very near" : h > 100 ? "near" : "far";
    const center = best.bbox[0] + best.bbox[2] / 2;
    let direction = center < canvas.width / 3 ? "on your left" :
                    center > (canvas.width / 3) * 2 ? "on your right" : "front";
    const text = `${best.class}, ${direction}, ${distance}.`;
    speak(text);
    lastSpokenDisplay.textContent = text;
    lastSpokenObject = best.class;
    lastSpokenTime = now;
  }
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 1.1;
  window.speechSynthesis.speak(u);
}

contextButtons.forEach(button => {
  button.addEventListener('click', () => {
    contextButtons.forEach(b => b.classList.remove('active-context'));
    button.classList.add('active-context');
    let color = 'border-gray-700';
    if (button.id === 'btn-outdoor') color = 'border-blue-500';
    if (button.id === 'btn-indoor') color = 'border-yellow-500';
    if (button.id === 'btn-identify') color = 'border-purple-500';
    containerBorder.className = `video-container w-full bg-gray-800 rounded-lg border-4 ${color}`;
    const msg = `Switched to ${button.textContent.trim()} mode.`;
    speak(msg);
    lastSpokenDisplay.textContent = msg;
  });
});

loadModel();
