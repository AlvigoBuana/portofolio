<template>
  <div ref="aboutTrackRef" class="about-track">
    <section
      id="about"
      ref="aboutSectionRef"
      :class="{ 'is-content-revealed': isAboutRevealed }"
      :style="aboutMotionStyle"
    >
      <video
        ref="aboutVideoRef"
        class="about-video"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true"
        tabindex="-1"
        @error="handleAboutVideoError"
      >
        <source src="/aboutBackground.mp4" type="video/mp4" />
      </video>
      <div class="about-video-overlay" aria-hidden="true"></div>
      <div class="content-wrapper about-content">
        <div class="title-block">
          <p class="section-kicker animated-item">
            The person behind the pixels
          </p>
          <h2 class="section-title animated-item">About Me</h2>
          <p class="subtitle animated-item">
            You can't love what you don't know
          </p>
        </div>

        <div
          class="about-details"
          :class="{ 'is-revealed': isAboutRevealed }"
          :inert="!isAboutRevealed"
        >
          <div class="intro-flex">
            <div class="intro-text">
              <h1 class="animated-item from-left">
                Hello, I'm<br /><span class="highlight-name"
                  >Alvigo Wahyu Buana</span
                >
              </h1>
              <p class="bio animated-item from-left">
                A Beginner Web Developer who's still Learning. I Like to create
                modern, responsive, and mobile friendly website design. Ready to
                turn your problems into digital website solutions. Let's
                collaborate to bring your ideas to life!
              </p>
              <div class="quote animated-item from-left">
                <p>"Don't Be Sorry, Be Better"</p>
                <span class="author">- Atreus, Anak e Kratos</span>
              </div>
              <div class="action-buttons animated-item">
                <a
                  href="https://docs.google.com/document/d/1WK3gCM0rMtvzw2dw22KOVe1nULW5ojsFqohXWfrb_X4/edit?usp=sharing"
                  download
                  class="btn btn-primary"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  <span>Download CV</span>
                </a>
                <a href="#journey" class="btn btn-secondary">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>View Projects</span>
                </a>
              </div>
            </div>
            <div class="intro-photo animated-item from-right">
              <img src="/profil2.png" alt="Alvigo Wahyu Buana" />
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-item animated-item" @click="scrollToJourney">
              <div class="stat-icon-wrapper">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  ></path>
                </svg>
              </div>
              <span class="stat-number">10+</span>
              <p class="stat-title">TOTAL PROJECTS</p>
              <p class="stat-desc">Innovative web solutions</p>
              <div class="stat-arrow">➔</div>
            </div>
            <div class="stat-item animated-item" @click="scrollToJourney">
              <div class="stat-icon-wrapper">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  ></path>
                </svg>
              </div>
              <span class="stat-number">5+</span>
              <p class="stat-title">CERTIFICATES</p>
              <p class="stat-desc">Professional skills validated</p>
              <div class="stat-arrow">➔</div>
            </div>
            <div class="stat-item animated-item" @click="scrollToJourney">
              <div class="stat-icon-wrapper">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9a9 9 0 019-9"
                  ></path>
                </svg>
              </div>
              <span class="stat-number">1+</span>
              <p class="stat-title">YEARS OF EXPERIENCE</p>
              <p class="stat-desc">Continuous learning journey</p>
              <div class="stat-arrow">➔</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <canvas ref="aboutWaveRef" class="about-wave" aria-hidden="true"></canvas>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { createSteppedScrollController } from "~/utils/steppedScroll.js";

const aboutTrackRef = ref(null);
const aboutSectionRef = ref(null);
const aboutWaveRef = ref(null);
const aboutVideoRef = ref(null);
const aboutProgress = ref(0);
const isAboutRevealed = ref(false);
const detailsRevealThreshold = 0.98;
const aboutClipPath = ref("none");
const aboutMotionStyle = computed(() => ({
  clipPath: aboutClipPath.value,
}));
let observer = null;
let progressFrameId = 0;
let burnAnimationFrameId = 0;
let lastBurnFrameTime = 0;
let burnProgress = 0;
let waveContext = null;
let canvasWidth = 0;
let canvasHeight = 0;
let canvasScale = 1;
let stopSteppedScroll = null;
let motionPreference = null;

const updateAboutVideoMotionPreference = () => {
  if (!aboutVideoRef.value) return;

  if (motionPreference?.matches) {
    aboutVideoRef.value.pause();
  } else {
    aboutVideoRef.value.play().catch((error) => {
      console.warn("About background video autoplay was prevented.", error);
    });
  }
};

const handleAboutVideoError = (event) => {
  const video = event.currentTarget;
  console.error("About background video could not be loaded.", {
    source: video.currentSrc,
    mediaErrorCode: video.error?.code,
    mediaErrorMessage: video.error?.message,
  });
};

const hashNoise = (value) => {
  const result = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return result - Math.floor(result);
};

const noise = (value, phase) => {
  const shifted = value + phase;
  const left = Math.floor(shifted);
  const fraction = shifted - left;
  const smoothFraction = fraction * fraction * (3 - 2 * fraction);

  return (
    hashNoise(left) * (1 - smoothFraction) +
    hashNoise(left + 1) * smoothFraction
  );
};

const getWaterline = (x, baseY, drift, phase) => {
  const shiftedX = x + drift;
  const swell =
    Math.sin(shiftedX * 0.003 + phase * 0.24) * 10 +
    Math.sin(shiftedX * 0.009 - phase * 0.17) * 6;
  const chop =
    (noise(shiftedX * 0.018, phase * 0.13) - 0.5) * 28 +
    (noise(shiftedX * 0.052, -phase * 0.19) - 0.5) * 22 +
    (noise(shiftedX * 0.15, phase * 0.23) - 0.5) * 16 +
    (noise(shiftedX * 0.43, -phase * 0.31) - 0.5) * 8;

  return baseY + swell + chop;
};

const createClipPath = (progress, phase, drift) => {
  const amplitude = Math.sin(progress * Math.PI);
  const segments = Math.ceil(canvasWidth / 5);
  const edge = [];
  const baseY = canvasHeight * (1 - progress);

  for (let index = segments; index >= 0; index -= 1) {
    const x = (canvasWidth * index) / segments;
    const waterline = getWaterline(x, baseY, drift, phase);
    const y = baseY + (waterline - baseY) * amplitude;
    edge.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  const burnHoles = [];
  const holeCount = Math.max(4, Math.round(canvasWidth / 140));
  for (let index = 0; index < holeCount; index += 1) {
    const seed = index * 43.7 + 9.2;
    const x =
      (hashNoise(seed) * canvasWidth +
        Math.sin(seed + phase * 0.1) * 9 +
        canvasWidth) %
      canvasWidth;
    const y =
      getWaterline(x, baseY, drift, phase) +
      (hashNoise(seed + 6.1) - 0.5) * 44 * amplitude;
    const radius = (8 + hashNoise(seed + 12.4) * 18) * Math.sqrt(amplitude);
    const vertices = [];
    const vertexCount = 8;

    for (let vertex = 0; vertex < vertexCount; vertex += 1) {
      const angle = -((vertex / vertexCount) * Math.PI * 2);
      const unevenRadius =
        radius * (0.72 + hashNoise(seed + vertex * 3.1) * 0.55);
      vertices.push({
        x: x + Math.cos(angle) * unevenRadius,
        y: y + Math.sin(angle) * unevenRadius * 0.7,
      });
    }

    const midpoints = vertices.map((vertex, vertexIndex) => {
      const next = vertices[(vertexIndex + 1) % vertexCount];
      return { x: (vertex.x + next.x) / 2, y: (vertex.y + next.y) / 2 };
    });
    let holePath = `M ${midpoints[vertexCount - 1].x.toFixed(1)} ${midpoints[vertexCount - 1].y.toFixed(1)}`;
    vertices.forEach((vertex, vertexIndex) => {
      holePath += ` Q ${vertex.x.toFixed(1)} ${vertex.y.toFixed(1)} ${midpoints[vertexIndex].x.toFixed(1)} ${midpoints[vertexIndex].y.toFixed(1)}`;
    });
    burnHoles.push(`${holePath} Z`);
  }

  const path = `M 0 0 H ${canvasWidth.toFixed(1)} L ${edge.join(" L ")} L 0 0 Z ${burnHoles.join(" ")}`;
  return `path('${path}')`;
};

const resizeWaveCanvas = () => {
  const canvas = aboutWaveRef.value;
  if (!canvas) return;

  const bounds = canvas.getBoundingClientRect();
  canvasWidth = bounds.width;
  canvasHeight = bounds.height;
  canvasScale = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(canvasWidth * canvasScale);
  canvas.height = Math.round(canvasHeight * canvasScale);
  waveContext = canvas.getContext("2d");
  waveContext?.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);
};

const drawWave = (progress, animationPhase = 0) => {
  const context = waveContext;
  if (!context || !canvasWidth || !canvasHeight) return;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  if (progress <= 0) {
    aboutClipPath.value = "none";
    return;
  }

  const phase = progress * Math.PI * 8 + animationPhase;
  const drift = progress * canvasWidth * 0.24 + animationPhase * 18;
  const waterlineY = canvasHeight * (1 - progress);
  const noiseAmount = Math.sin(progress * Math.PI);
  const step = Math.max(2, canvasWidth / 700);
  const points = [];

  for (let x = -step; x <= canvasWidth + step; x += step) {
    points.push({
      x,
      y:
        waterlineY +
        (getWaterline(x, waterlineY, drift, phase) - waterlineY) * noiseAmount,
    });
  }

  aboutClipPath.value = createClipPath(progress, phase, drift);

  context.save();
  context.globalAlpha = noiseAmount;
  context.globalCompositeOperation = "source-over";

  const burnGlow = context.createLinearGradient(
    0,
    waterlineY - 100,
    0,
    waterlineY + 100,
  );
  burnGlow.addColorStop(0, "rgba(9, 11, 14, 0)");
  burnGlow.addColorStop(0.31, "rgba(9, 11, 14, 0.22)");
  burnGlow.addColorStop(0.48, "rgba(35, 39, 42, 0.06)");
  burnGlow.addColorStop(0.56, "rgba(9, 11, 14, 0.16)");
  burnGlow.addColorStop(1, "rgba(9, 11, 14, 0)");
  context.fillStyle = burnGlow;
  context.fillRect(0, waterlineY - 100, canvasWidth, 200);

  for (let layer = 0; layer < 4; layer += 1) {
    context.beginPath();
    points.forEach((point, index) => {
      const textureY =
        point.y +
        (5 + layer * 7) * noiseAmount +
        Math.sin((point.x + drift * 0.7) * 0.012 + phase * 0.37 + layer) *
          (2 + layer);
      if (index === 0) context.moveTo(point.x, textureY);
      else context.lineTo(point.x, textureY);
    });

    context.strokeStyle = `rgba(34, 38, 41, ${0.09 - layer * 0.015})`;
    context.lineWidth = layer === 0 ? 1 : 0.65;
    context.stroke();
  }

  context.restore();
};

const animateBurnEdge = (timestamp) => {
  burnAnimationFrameId = 0;
  if (
    burnProgress <= 0 ||
    burnProgress >= 1 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  if (timestamp - lastBurnFrameTime >= 40) {
    lastBurnFrameTime = timestamp;
    drawWave(burnProgress, timestamp * 0.00022);
  }

  burnAnimationFrameId = requestAnimationFrame(animateBurnEdge);
};

const startBurnAnimation = () => {
  if (
    burnAnimationFrameId ||
    burnProgress <= 0 ||
    burnProgress >= 1 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  burnAnimationFrameId = requestAnimationFrame(animateBurnEdge);
};

const updateAboutProgress = () => {
  progressFrameId = 0;
  const track = aboutTrackRef.value;
  if (!track) return;

  const trackTop = track.getBoundingClientRect().top;
  const scrolledPastTrackStart = Math.max(-trackTop, 0);
  const settleDistance = Math.max(window.innerHeight * 0.5, 1);
  const transitionProgress = Math.min(
    Math.max((scrolledPastTrackStart - settleDistance) / window.innerHeight, 0),
    1,
  );

  aboutProgress.value = Math.min(scrolledPastTrackStart / settleDistance, 1);
  const aboutHasSettled =
    trackTop <= 1 || aboutProgress.value >= detailsRevealThreshold;
  isAboutRevealed.value =
    window.innerWidth <= 992 ||
    aboutHasSettled && transitionProgress <= 0.001;
  burnProgress = window.innerWidth <= 992 ? 0 : transitionProgress;
  drawWave(burnProgress, performance.now() * 0.00022);
  if (burnProgress > 0 && burnProgress < 1) {
    startBurnAnimation();
  } else if (burnAnimationFrameId) {
    cancelAnimationFrame(burnAnimationFrameId);
    burnAnimationFrameId = 0;
  }
};

const scheduleAboutProgress = () => {
  if (!progressFrameId) {
    progressFrameId = requestAnimationFrame(updateAboutProgress);
  }
};

const scrollToJourney = () => {
  const journeySection = document.getElementById("journey");

  if (journeySection) {
    journeySection.scrollIntoView({ behavior: "smooth" });
  }
};

onMounted(() => {
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  updateAboutVideoMotionPreference();
  motionPreference.addEventListener("change", updateAboutVideoMotionPreference);
  resizeWaveCanvas();
  stopSteppedScroll = createSteppedScrollController(() => {
    const track = aboutTrackRef.value;
    if (!track || window.innerWidth <= 992) return [];

    const start = track.getBoundingClientRect().top + window.scrollY;
    const settleDistance = window.innerHeight * 0.5;
    const transitionDistance = window.innerHeight;
    return [
      start,
      ...[0.2, 0.5, 0.8, 1].map(
        (progress) => start + settleDistance + transitionDistance * progress,
      ),
    ];
  });
  updateAboutProgress();
  window.addEventListener("scroll", scheduleAboutProgress, { passive: true });
  window.addEventListener("resize", handleWaveResize);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Logic Animasi Replay
        if (entry.isIntersecting) {
          // Pas masuk layar: Tambah class (Mulai Animasi)
          entry.target.classList.add("in-view");
        } else {
          // Pas keluar layar: Hapus class (Reset Animasi biar bisa main lagi nanti)
          entry.target.classList.remove("in-view");
        }
      });
    },
    { threshold: 0.01 },
  );

  if (aboutSectionRef.value) {
    observer.observe(aboutSectionRef.value);
  }
});

const handleWaveResize = () => {
  resizeWaveCanvas();
  scheduleAboutProgress();
};

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  window.removeEventListener("scroll", scheduleAboutProgress);
  window.removeEventListener("resize", handleWaveResize);
  stopSteppedScroll?.();
  motionPreference?.removeEventListener(
    "change",
    updateAboutVideoMotionPreference,
  );
  if (progressFrameId) cancelAnimationFrame(progressFrameId);
});
</script>

<style scoped>
.about-track {
  position: relative;
  z-index: 1;
  height: 250svh;
  margin-top: -100svh;
  pointer-events: none;
}

#about {
  position: sticky;
  top: 0;
  z-index: 1;
  isolation: isolate;
  height: 100svh;
  background: #111820;
  padding-top: 50px;
  padding-bottom: 100px;
  scroll-margin-top: 80px;
  pointer-events: auto;
}

.about-video,
.about-video-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.about-video {
  z-index: 0;
  object-fit: cover;
  object-position: center;
  opacity: 0.62;
}

.about-video-overlay {
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(17, 24, 32, 0.55), rgba(17, 24, 32, 0.32)),
    linear-gradient(0deg, rgba(17, 24, 32, 0.52), rgba(17, 24, 32, 0.14));
}

.about-wave {
  position: sticky;
  top: 0;
  z-index: 3;
  display: block;
  width: 100%;
  height: 100svh;
  margin-top: -100svh;
  pointer-events: none;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem; /* HAPUS padding top/bottom bawaan global */
}

.about-details {
  opacity: 0;
  transform: translateY(1.5rem) scale(0.985);
  transition:
    opacity 450ms ease-out,
    transform 550ms cubic-bezier(0.2, 0.8, 0.25, 1);
  pointer-events: none;
}

.about-details.is-revealed {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.title-block {
  text-align: center;
  margin-bottom: 4rem;
}
.section-kicker {
  color: var(--pikachu-yellow);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}
.intro-flex {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 4rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* ... (lanjutkan CSS Typography, Photo, Buttons, Stats, Animasi, dll seperti sebelumnya) ... */
.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-white);
  margin-bottom: 0.5rem;
}
.subtitle {
  color: var(--pikachu-yellow);
  font-weight: 500;
}

.intro-text {
  flex: 1;
}
.intro-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}
.highlight-name {
  color: var(--pikachu-yellow);
}
.bio {
  color: rgb(209, 213, 219);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.quote {
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid var(--pikachu-yellow);
  padding: 1rem;
  margin-bottom: 2rem;
  font-style: italic;
  color: rgb(209, 213, 219);
}

.intro-photo {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 350px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}
.intro-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px transparent;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.3);
  transition: transform 0.4s ease-out;
}
.intro-photo:hover img {
  transform: scale(1.1);
}
.intro-photo::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 150%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-150%) skewX(-20deg);
  transition: transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.intro-photo:hover::after {
  transform: translateX(100%) skewX(-20deg);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}
.btn svg {
  width: 1.2rem;
  height: 1.2rem;
}
.btn-primary {
  background: var(--pikachu-yellow);
  color: var(--bg-dark);
  border: 2px solid var(--pikachu-yellow);
}
.btn-primary:hover {
  transform: translateY(-3px);
  color: #fff;
  border-color: #fff;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
}
.btn-secondary {
  background: transparent;
  color: var(--text-white);
  border: 2px solid rgb(75, 85, 99);
}
.btn-secondary:hover {
  border-color: var(--pikachu-yellow);
  color: var(--pikachu-yellow);
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);
}

.stat-item {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgb(75, 85, 99);
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}
.stat-item:hover {
  transform: translateY(-5px);
  border-color: var(--pikachu-yellow);
}
.stat-icon-wrapper {
  color: var(--pikachu-yellow);
  width: 32px;
  height: 32px;
  margin-bottom: 1rem;
}
.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-white);
}
.stat-title {
  font-weight: 500;
  margin-top: 0.5rem;
  color: rgb(209, 213, 219);
}
.stat-desc {
  font-size: 0.875rem;
  color: rgb(156, 163, 175);
}
.stat-arrow {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  font-size: 1.2rem;
  color: var(--pikachu-yellow);
  transform: rotate(-45deg);
  transition: transform 0.3s ease;
}
.stat-item:hover .stat-arrow {
  transform: rotate(0deg);
}

.animated-item {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
}
.from-left {
  transform: translateX(-50px);
}
.from-right {
  transform: translateX(50px);
}
#about.is-content-revealed .title-block .animated-item {
  opacity: 1;
  transform: translate(0, 0);
}
#about.is-content-revealed .title-block .animated-item:nth-child(1) {
  transition-delay: 0.1s;
}
#about.is-content-revealed .title-block .animated-item:nth-child(2) {
  transition-delay: 0.2s;
}
#about.is-content-revealed .title-block .animated-item:nth-child(3) {
  transition-delay: 0.3s;
}
.about-details.is-revealed .animated-item {
  opacity: 1;
  transform: translate(0, 0);
}
.about-details.is-revealed .intro-text .animated-item:nth-child(1) {
  transition-delay: 0.05s;
}
.about-details.is-revealed .intro-text .animated-item:nth-child(2) {
  transition-delay: 0.12s;
}
.about-details.is-revealed .intro-text .animated-item:nth-child(3) {
  transition-delay: 0.18s;
}
.about-details.is-revealed .intro-text .animated-item:nth-child(4) {
  transition-delay: 0.24s;
}
.about-details.is-revealed .intro-photo.animated-item {
  transition-delay: 0.16s;
}
.about-details.is-revealed .stats-grid .animated-item:nth-child(1) {
  transition-delay: 0.28s;
}
.about-details.is-revealed .stats-grid .animated-item:nth-child(2) {
  transition-delay: 0.36s;
}
.about-details.is-revealed .stats-grid .animated-item:nth-child(3) {
  transition-delay: 0.44s;
}

@media (max-width: 992px) {
  .intro-flex {
    flex-direction: column-reverse;
    gap: clamp(1.5rem, 4vw, 3rem);
    text-align: center;
  }
  .intro-photo {
    margin: 0 auto 1rem;
    width: min(44vw, 250px);
    max-width: 250px;
  }
  .action-buttons {
    justify-content: center;
  }
  .quote {
    margin-left: auto;
    margin-right: auto;
  }
}
@media (max-width: 992px) {
  .about-track {
    height: auto;
    min-height: 0;
    margin-top: 0;
  }

  #about {
    position: relative;
    top: auto;
    height: auto;
    min-height: 100svh;
    padding: clamp(6rem, 12vh, 7rem) 0 clamp(3rem, 8vh, 5rem);
  }

  .about-video {
    position: absolute;
    opacity: 0.5;
  }

  .about-video-overlay {
    background:
      linear-gradient(90deg, rgba(17, 24, 32, 0.66), rgba(17, 24, 32, 0.44)),
      linear-gradient(0deg, rgba(17, 24, 32, 0.7), rgba(17, 24, 32, 0.24));
  }

  .content-wrapper {
    padding-inline: clamp(1rem, 5vw, 2rem);
  }

  .title-block {
    margin-bottom: clamp(2rem, 7vw, 3.5rem);
  }

  .section-title {
    font-size: clamp(2.25rem, 9vw, 3rem);
  }

  .subtitle {
    font-size: clamp(0.95rem, 4vw, 1.1rem);
  }

  .intro-text h1 {
    font-size: clamp(1.8rem, 7.5vw, 2.5rem);
    overflow-wrap: anywhere;
  }

  .bio {
    font-size: clamp(0.9rem, 3.8vw, 1.05rem);
  }

  .stats-grid {
    gap: 0.85rem;
  }

  .stat-item {
    padding: clamp(1rem, 4vw, 1.5rem);
  }

  .stat-number {
    font-size: clamp(2rem, 8vw, 2.5rem);
  }

  .btn {
    min-height: 2.75rem;
    padding: 0.65rem clamp(1rem, 4vw, 1.5rem);
    font-size: clamp(0.9rem, 3.6vw, 1rem);
  }

  .stat-title { font-size: clamp(0.9rem, 3.8vw, 1rem); }
  .stat-desc { font-size: clamp(0.78rem, 3.3vw, 0.875rem); }

  .about-wave {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .about-video,
  .about-video-overlay {
    display: none;
  }

  #about {
    background:
      radial-gradient(ellipse at 82% 18%, rgba(86, 108, 121, 0.2), transparent 32rem),
      radial-gradient(ellipse at 14% 76%, rgba(68, 88, 101, 0.16), transparent 28rem),
      linear-gradient(145deg, #111820, #0c1218 72%, #10171e);
  }
}

@media (max-width: 380px) {
  .action-buttons {
    align-items: stretch;
  }

  .btn {
    justify-content: center;
    padding-inline: 1rem;
  }

  .intro-photo {
    width: min(58vw, 220px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-details,
  .about-details.is-revealed {
    transition: none;
  }
}
@media (min-width: 1024px) {
  .bio,
  .quote {
    max-width: 650px;
  }
}

.quote .author {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--pikachu-yellow);
  font-weight: 600;
  font-style: normal; /* Biar ga miring kayak quotenya */
}
</style>
