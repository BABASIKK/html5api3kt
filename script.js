// ========== Аудио-плеер ==========
const audio = document.getElementById("audio");

function playAudio() {
  audio.play();
}

function pauseAudio() {
  audio.pause();
}

function setAudioVolume() {
  audio.volume = document.getElementById("audio-volume").value;
}

// ========== Видео-плеер ==========
const video = document.getElementById("video");

function playVideo() {
  video.play();
}

function pauseVideo() {
  video.pause();
}

function setVideoVolume() {
  video.volume = document.getElementById("video-volume").value;
}

// ========== Анимация на Canvas ==========
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let animationId;
const circles = [];

// Функция для создания круга с рандомными позициями и скоростями
function createCircle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 15 + Math.random() * 20,
    dx: (Math.random() - 0.5) * 4,
    dy: (Math.random() - 0.5) * 4,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`
  };
}

// Создаем несколько кругов
for (let i = 0; i < 10; i++) {
  circles.push(createCircle());
}

// Рисование и обновление круга
function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();

    // Обновление позиции круга
    circle.x += circle.dx;
    circle.y += circle.dy;

    // Отражение от стен
    if (circle.x + circle.radius > canvas.width || circle.x - circle.radius < 0) {
      circle.dx *= -1;
    }
    if (circle.y + circle.radius > canvas.height || circle.y - circle.radius < 0) {
      circle.dy *= -1;
    }
  });
}

// Анимация с использованием requestAnimationFrame
function animate() {
  drawCircles();
  animationId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (!animationId) {
    animate();
  }
}

function stopAnimation() {
  cancelAnimationFrame(animationId);
  animationId = null;
}


// ========== Обработка изображений ==========
const imageCanvas = document.getElementById("image-canvas");
const imageCtx = imageCanvas.getContext("2d");
let loadedImage;

function loadImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        loadedImage = img;
        imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function applyFilter(filter) {
  if (!loadedImage) return;
  imageCtx.drawImage(loadedImage, 0, 0, imageCanvas.width, imageCanvas.height);

  const imageData = imageCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
  const data = imageData.data;

  if (filter === "grayscale") {
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;        // Red
      data[i + 1] = avg;    // Green
      data[i + 2] = avg;    // Blue
    }
  }

  imageCtx.putImageData(imageData, 0, 0);
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "processed-image.png";
  link.href = imageCanvas.toDataURL();
  link.click();
}