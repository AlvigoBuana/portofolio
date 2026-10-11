<template>
  <div ref="homeTrackRef" class="home-scroll-track">
    <section id="home" ref="homeSectionRef" :style="{ clipPath: homeClipPath }">
      <div class="home-bg" :class="{ 'is-leaving': isHomeLeaving }">
        <div class="home-bg-zoom">
          <BackgroundVideo
            class="home-video"
            src="/homeClip.mp4"
            poster="/homeClip-poster.webp"
            :active="!isHomeGone"
          />
          <div class="home-video-overlay" aria-hidden="true"></div>
        </div>
      </div>
      <div class="home-video-overlay" aria-hidden="true"></div>
      <div
        class="content-wrapper home-content"
        :class="{ 'is-revealed': isHomeRevealed }"
        :inert="!isHomeRevealed"
      >
        <div class="home-flex">
          <div class="left-content">
            <p class="section-kicker anim-item anim-up">
              Independent developer · Indonesia
            </p>

            <div class="innovation-badge anim-item anim-up">
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Ready to Innovate</span>
            </div>

            <h1
              class="main-title anim-item anim-left"
              style="transition-delay: 0.2s"
            >
              <span class="title-frontend">Frontend</span>
              <span class="title-developer">Developer</span>
            </h1>

            <div
              class="typing-container anim-item anim-left"
              style="transition-delay: 0.4s"
            >
              <span class="typing-text">
                {{ currentText }}
                <span class="cursor">|</span>
              </span>
            </div>

            <p
              class="description anim-item anim-up"
              style="transition-delay: 0.6s"
            >
              Still learning and exploring the world of web development. I'm
              Alvigo Wahyu Buana, a tech and game enthusiast. I like creating
              innovative Web Development. Join me on this journey of discovery
              and growth.
            </p>

            <div
              class="tech-stack anim-item anim-up"
              style="transition-delay: 0.8s"
            >
              <span v-for="tech in techStack" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>

            <div
              class="action-buttons anim-item anim-up"
              style="transition-delay: 1s"
            >
              <button class="btn-projects" @click="scrollToSection('#journey')">
                <span>Journey</span>
                <svg
                  class="btn-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
              <button class="btn-contact" @click="scrollToSection('#contact')">
                <span>Contact</span>
                <svg
                  class="btn-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            <div
              class="social-links anim-item anim-up"
              style="transition-delay: 1.2s"
            >
              <a
                v-for="social in socialMedia"
                :key="social.name"
                :href="social.href"
                class="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  :src="social.image"
                  :alt="social.name"
                  class="social-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <canvas ref="waveCanvasRef" class="home-wave" aria-hidden="true"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { registerScrollStops } from "~/utils/steppedScroll.js";
import { scrollToSection } from "~/utils/navigation.js";
import { createScrollBurnTransition } from "~/utils/scrollBurnTransition.js";

const MOBILE_BREAKPOINT = 992;

const texts = ["Alvigo Wahyu Buana", "Tech & Game Enthusiast"];
const techStack = ["React", "Javascript", "Python", "TailwindCSS"];
const socialMedia = [
  { name: "github", href: "https://github.com/AlvigoBuana", image: "/github.svg" },
  {
    name: "linkedin",
    href: "https://www.linkedin.com/in/alvigo-wahyu-buana-83bb712b6/",
    image: "/linkedin.svg",
  },
  { name: "instagram", href: "https://instagram.com/alvgwb_", image: "/instagram.svg" },
];

const homeTrackRef = ref(null);
const homeSectionRef = ref(null);
const waveCanvasRef = ref(null);

const homeClipPath = ref("none");
const currentText = ref("");
const prefersReducedMotion = ref(false);
const isHomeRevealed = ref(false);
const isHomeLeaving = ref(false);
const isHomeGone = ref(false);

let observer = null;
let motionPreference = null;
let waveFrameId = 0;
let unregisterStops = null;
let burn = null;
let typingTimeoutId = 0;

// --- Burn transition ---
const handleBurnProgress = (progress) => {
  // Hanya on/off, jadi zoom-out berjalan sekali lewat CSS transition
  isHomeLeaving.value = progress > 0.01;
  isHomeGone.value = progress >= 0.99;
};

const updateWaveProgress = () => {
  waveFrameId = 0;
  const track = homeTrackRef.value;
  if (!track) return;

  if (window.innerWidth <= MOBILE_BREAKPOINT) {
    isHomeRevealed.value =
      homeSectionRef.value?.classList.contains("in-view") ?? false;
    burn?.setProgress(0);
    return;
  }

  const trackHeight = track.offsetHeight;
  const scrollDistance = Math.max(trackHeight - window.innerHeight, 1);
  const trackProgress = Math.min(
    Math.max(
      (trackHeight - track.getBoundingClientRect().bottom) / scrollDistance,
      0,
    ),
    1,
  );
  isHomeRevealed.value = trackProgress <= 0.001;
  burn?.setProgress(trackProgress);
};

const scheduleWaveUpdate = () => {
  if (!waveFrameId) waveFrameId = requestAnimationFrame(updateWaveProgress);
};

const handleWaveResize = () => {
  burn?.resize();
  scheduleWaveUpdate();
};

const updateMotionPreference = () => {
  prefersReducedMotion.value = motionPreference?.matches ?? false;
  if (prefersReducedMotion.value) isHomeRevealed.value = true;
  burn?.refresh();
};

// --- Typing effect ---
let typingTextIndex = 0;
let typingCharIndex = 0;
let typingDeleting = false;

const typeStep = () => {
  const full = texts[typingTextIndex];
  let delay = 100;

  if (!typingDeleting) {
    typingCharIndex += 1;
    currentText.value = full.slice(0, typingCharIndex);
    if (typingCharIndex === full.length) {
      typingDeleting = true;
      delay = 2000; // jeda saat teks penuh
    }
  } else {
    typingCharIndex -= 1;
    currentText.value = full.slice(0, typingCharIndex);
    delay = 50; // menghapus lebih cepat dari mengetik
    if (typingCharIndex === 0) {
      typingDeleting = false;
      typingTextIndex = (typingTextIndex + 1) % texts.length;
      delay = 400; // jeda sebelum teks berikutnya
    }
  }

  typingTimeoutId = window.setTimeout(typeStep, delay);
};

onMounted(() => {
  typingTimeoutId = window.setTimeout(typeStep, 100);

  unregisterStops = registerScrollStops("home", () => {
    const track = homeTrackRef.value;
    if (!track || window.innerWidth <= MOBILE_BREAKPOINT) return [];

    const start = track.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(track.offsetHeight - window.innerHeight, 1);
    return [
      start,
      ...[0.2, 0.5, 0.8, 1].map((progress) => start + distance * progress),
    ];
  });

  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  burn = createScrollBurnTransition({
    getCanvas: () => waveCanvasRef.value,
    onClipPath: (value) => {
      homeClipPath.value = value;
    },
    onProgress: handleBurnProgress,
    shouldReduceMotion: () => prefersReducedMotion.value,
  });
  updateMotionPreference();
  motionPreference.addEventListener("change", updateMotionPreference);
  burn.resize();
  updateWaveProgress();
  window.addEventListener("scroll", scheduleWaveUpdate, { passive: true });
  window.addEventListener("resize", handleWaveResize);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("in-view", entry.isIntersecting);

        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          isHomeRevealed.value = entry.isIntersecting;
        }
      });
    },
    { threshold: 0.1 },
  );

  if (homeSectionRef.value) observer.observe(homeSectionRef.value);
});

onBeforeUnmount(() => {
  window.clearTimeout(typingTimeoutId);
  unregisterStops?.();
  observer?.disconnect();
  motionPreference?.removeEventListener("change", updateMotionPreference);
  window.removeEventListener("scroll", scheduleWaveUpdate);
  window.removeEventListener("resize", handleWaveResize);
  if (waveFrameId) cancelAnimationFrame(waveFrameId);
  burn?.destroy();
});
</script>

<style scoped>
/* ===== LAYOUT DASAR ===== */
.home-scroll-track {
  position: relative;
  height: 200svh;
  background: #111820;
}

#home {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100svh;
  padding-top: 80px;
  overflow: hidden;
  isolation: isolate;
  background: #100e0a;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.home-wave {
  position: sticky;
  top: 0;
  z-index: 3;
  display: block;
  width: 100%;
  height: 100svh;
  margin-top: -100svh;
  pointer-events: none;
}

/* ===== BACKGROUND: satu wrapper di-zoom, isinya (video + overlay) ikut menyatu ===== */
.home-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.home-bg-zoom {
  position: absolute;
  inset: 0;
  transform: scale(1.12);
  transition: transform 1100ms cubic-bezier(0.2, 0.7, 0.2, 1);
  will-change: transform;
}

.home-bg.is-leaving .home-bg-zoom {
  transform: scale(1);
}

.home-video,
.home-video-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.home-video {
  display: block;
  object-fit: cover;
  object-position: center;
  opacity: 1;
}

.home-video-overlay {
  background:
    linear-gradient(90deg, rgba(9, 8, 6, 0.7), rgba(9, 8, 6, 0.15)),
    linear-gradient(0deg, rgba(9, 8, 6, 0.4), transparent 15%);
}

.anim-item {
  opacity: 0;
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
}
.anim-up {
  transform: translateY(30px);
}
.anim-left {
  transform: translateX(-50px);
}

.home-content {
  transition:
    opacity 650ms ease,
    transform 650ms cubic-bezier(0.2, 0.8, 0.25, 1);
}

.home-content:not(.is-revealed) {
  opacity: 0;
  transform: translateY(1.25rem) scale(0.94);
  pointer-events: none;
}

.home-content.is-revealed {
  transition-delay: 250ms;
}

.home-content.is-revealed .anim-item {
  opacity: 1;
  transform: translate(0, 0);
}

.home-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.left-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.section-kicker {
  margin-bottom: 1.25rem;
  color: var(--pikachu-yellow);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  line-height: 1.5;
  text-transform: uppercase;
}

/* Badge */
.innovation-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(240, 220, 171, 0.3);
  border-radius: 9999px;
  background: rgba(16, 14, 10, 0.48);
  backdrop-filter: blur(12px);
  color: rgb(231, 192, 19);
  font-size: 0.875rem;
  font-weight: 500;
}
.innovation-badge .icon {
  width: 1rem;
  height: 1rem;
}

/* Typography */
.main-title {
  margin-bottom: 1rem;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.8rem, 6vw, 4.5rem);
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 1.1;
}

.title-frontend {
  display: block;
  color: white;
}
.title-developer {
  background: linear-gradient(135deg, #f0dcab, #d7b56d, #a77a40);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.typing-container {
  display: flex;
  align-items: center;
  height: 3rem;
  margin-bottom: 1.5rem;
}
.typing-text {
  color: var(--pikachu-yellow);
  font-size: clamp(1.25rem, 2.7vw, 2rem);
  font-weight: 500;
}
.cursor {
  margin-left: 2px;
  animation: blink 1s infinite;
}
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.description {
  max-width: 36rem;
  margin-bottom: 2rem;
  color: #d1d5db;
  font-size: 1.125rem;
  line-height: 1.6;
}

/* Tech stack */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}
.tech-tag {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(240, 220, 171, 0.24);
  border-radius: 9999px;
  background: rgba(16, 14, 10, 0.48);
  backdrop-filter: blur(10px);
  color: #d1d9db;
  font-size: 0.875rem;
  transition: 0.3s;
}
.tech-tag:hover {
  border-color: var(--pikachu-yellow);
  color: var(--pikachu-yellow);
}

/* Buttons */
.action-buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}
.btn-projects,
.btn-contact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}
.btn-projects {
  border: none;
  background: linear-gradient(135deg, #e3c17c, #aa7939);
  box-shadow: 0 4px 24px rgba(190, 137, 60, 0.3);
  color: white;
}
.btn-projects:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 28px rgba(190, 137, 60, 0.5);
}
.btn-contact {
  border: 1px solid rgba(243, 239, 228, 0.28);
  background: rgba(16, 14, 10, 0.38);
  backdrop-filter: blur(10px);
  color: #f3efe4;
}
.btn-contact:hover {
  border-color: var(--pikachu-yellow);
  color: var(--pikachu-yellow);
  transform: translateY(-3px);
}
.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* Socials */
.social-links {
  display: flex;
  gap: 1rem;
}
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: 1px solid rgba(243, 239, 228, 0.26);
  border-radius: 0.5rem;
  background: rgba(16, 14, 10, 0.48);
  backdrop-filter: blur(10px);
  transition: 0.3s;
}
.social-link:hover {
  border-color: var(--pikachu-yellow);
  transform: translateY(-3px);
}
.social-icon {
  width: 1.5rem;
  height: 1.5rem;
  filter: brightness(0.8);
  transition: 0.3s;
}
.social-link:hover .social-icon {
  filter: brightness(1);
  transform: scale(1.1);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .home-flex {
    justify-content: flex-start;
    gap: 0;
  }
  .left-content {
    width: 100%;
  }
  .main-title {
    font-size: 3.5rem;
  }
  .description {
    max-width: 80%;
  }
}

@media (max-width: 992px) {
  .home-scroll-track {
    height: auto;
  }

  #home {
    position: relative;
    height: auto;
    min-height: 100svh;
    padding: clamp(6rem, 11vh, 7rem) clamp(1.25rem, 5vw, 3rem)
      clamp(4rem, 8vh, 6rem);
  }

  .home-wave {
    display: none;
  }
}

@media (max-width: 768px) {
  #home {
    padding: 6rem clamp(1rem, 5vw, 1.5rem) 4rem;
  }

  .main-title {
    font-size: clamp(2.45rem, 10vw, 3.25rem);
  }
  .typing-text {
    font-size: clamp(1.2rem, 5.5vw, 1.5rem);
  }
  .description {
    max-width: 100%;
  }
  .typing-container {
    width: 100%;
    height: auto;
    min-height: 3rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 300px;
  }
  .btn-projects,
  .btn-contact {
    justify-content: center;
    width: 100%;
    min-height: 2.75rem;
  }
}

@media (max-width: 768px) and (max-height: 560px) {
  #home {
    padding-block: 5rem 2.5rem;
  }
  .tech-stack,
  .action-buttons {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 380px) {
  #home {
    padding-inline: 1rem;
  }
  .content-wrapper {
    padding-inline: 0;
  }
  .main-title {
    font-size: clamp(2.15rem, 10vw, 2.6rem);
  }
  .social-links {
    gap: 0.65rem;
  }
}

/* ===== REDUCED MOTION (satu blok untuk semuanya) ===== */
@media (prefers-reduced-motion: reduce) {
  .home-bg-zoom,
  .home-bg.is-leaving .home-bg-zoom {
    transform: none;
    transition: none;
  }

  .home-content,
  .home-content:not(.is-revealed),
  .anim-item {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>