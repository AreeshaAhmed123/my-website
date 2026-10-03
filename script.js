const modeButtons = document.querySelectorAll(".mode");
const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const dropZone = document.getElementById("dropZone");
const uploadTitle = document.getElementById("uploadTitle");
const uploadText = document.getElementById("uploadText");
const fileName = document.getElementById("fileName");
const previewWrap = document.getElementById("previewWrap");
const preview = document.getElementById("preview");
const removeBtn = document.getElementById("removeBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const emptyResult = document.getElementById("emptyResult");
const result = document.getElementById("result");
const status = document.getElementById("status");
const resultMode = document.getElementById("resultMode");
const confidenceValue = document.getElementById("confidenceValue");
const confidenceBar = document.getElementById("confidenceBar");
const resultMessage = document.getElementById("resultMessage");

let currentMode = "image";
let selectedFile = null;
let objectUrl = null;

const modeConfig = {
  image: {
    title: "Upload an image",
    text: "Drag & drop your image here, or click to browse.",
    accept: ".jpg,.jpeg,.png,.webp",
    label: "Image"
  },
  video: {
    title: "Upload a video",
    text: "Upload a video without relying on its audio track.",
    accept: ".mp4,.mov,.avi,.mkv,.webm",
    label: "Video Only"
  },
  audio: {
    title: "Upload an audio file",
    text: "Upload speech or voice audio for analysis.",
    accept: ".wav,.mp3,.m4a,.flac,.ogg",
    label: "Audio Only"
  },
  "video-audio": {
    title: "Upload a video with audio",
    text: "Upload a video containing both visual and audio information.",
    accept: ".mp4,.mov,.mkv,.webm",
    label: "Video + Audio"
  }
};

function updateMode(mode) {
  currentMode = mode;
  modeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.mode === mode));
  const cfg = modeConfig[mode];
  uploadTitle.textContent = cfg.title;
  uploadText.textContent = cfg.text;
  fileInput.accept = cfg.accept;
  resetFile();
  resetResult();
}

modeButtons.forEach(btn => btn.addEventListener("click", () => updateMode(btn.dataset.mode)));
browseBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", e => {
  if (e.target.files[0]) setFile(e.target.files[0]);
});

["dragenter", "dragover"].forEach(event => dropZone.addEventListener(event, e => {
  e.preventDefault();
  dropZone.classList.add("drag");
}));
["dragleave", "drop"].forEach(event => dropZone.addEventListener(event, e => {
  e.preventDefault();
  dropZone.classList.remove("drag");
}));
dropZone.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
});

function setFile(file) {
  selectedFile = file;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);

  fileName.textContent = `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`;
  preview.innerHTML = "";

  if (currentMode === "image") {
    const img = document.createElement("img");
    img.src = objectUrl;
    preview.appendChild(img);
  } else if (currentMode === "audio") {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = objectUrl;
    preview.appendChild(audio);
  } else {
    const video = document.createElement("video");
    video.controls = true;
    video.src = objectUrl;
    preview.appendChild(video);
  }

  previewWrap.classList.remove("hidden");
  analyzeBtn.disabled = false;
  status.textContent = "Ready";
}

function resetFile() {
  selectedFile = null;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = null;
  fileInput.value = "";
  fileName.textContent = "";
  preview.innerHTML = "";
  previewWrap.classList.add("hidden");
  analyzeBtn.disabled = true;
}

function resetResult() {
  emptyResult.classList.remove("hidden");
  result.classList.add("hidden");
  status.textContent = "Waiting";
}

removeBtn.addEventListener("click", () => {
  resetFile();
  resetResult();
});

analyzeBtn.addEventListener("click", () => {
  if (!selectedFile) return;

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";
  status.textContent = "Processing";

  setTimeout(() => {
    const confidence = (86 + Math.random() * 11).toFixed(1);
    resultMode.textContent = modeConfig[currentMode].label;
    confidenceValue.textContent = `${confidence}%`;
    confidenceBar.style.width = `${confidence}%`;
    resultMessage.textContent = "Demo prediction";

    emptyResult.classList.add("hidden");
    result.classList.remove("hidden");
    status.textContent = "Complete";

    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze Media";
  }, 1200);
});
