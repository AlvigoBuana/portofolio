<template>
  <div ref="aboutTrackRef" class="about-track">
    <section
      id="about"
      ref="aboutSectionRef"
      :class="{ 'is-content-revealed': isAboutRevealed }"
      :style="aboutMotionStyle"
    >
      <div class="about-bg" :class="{ 'is-zoomed': isAboutRevealed }">
        <div class="about-bg-zoom">
          <BackgroundVideo
            class="about-video"
            src="/aboutClip.mp4"
            poster="/aboutClip-poster.webp"
            :active="!isAboutGone"
          />
          <div class="about-video-overlay" aria-hidden="true"></div>
        </div>
      </div>
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
              <img src="/profil2.webp" alt="Alvigo Wahyu Buana" />
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
import { registerScrollStops } from "~/utils/steppedScroll.js";
import { scrollToSection } from "~/utils/navigation.js";
import { createScrollBurnTransition } from "~/utils/scrollBurnTransition.js";

const MOBILE_BREAKPOINT = 992;
const DETAILS_REVEAL_THRESHOLD = 0.98;

const aboutTrackRef = ref(null);
const aboutSectionRef = ref(null);
const aboutWaveRef = ref(null);

const aboutClipPath = ref("none");
const isAboutRevealed = ref(false);
const isAboutGone = ref(false);
const aboutMotionStyle = computed(() => ({
  clipPath: aboutClipPath.value,
}));

let observer = null;
let progressFrameId = 0;
let unregisterStops = null;
let motionPreference = null;
let burn = null;

// Hanya dipakai untuk mem-pause video setelah tertutup sepenuhnya
const handleBurnProgress = (progress) => {
  isAboutGone.value = progress >= 0.99;
};

const handleMotionChange = () => burn?.refresh();

const updateAboutProgress = () => {
  progressFrameId = 0;
  const track = aboutTrackRef.value;
  if (!track) return;

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const trackTop = track.getBoundingClientRect().top;
  const scrolledPastTrackStart = Math.max(-trackTop, 0);
  const settleDistance = Math.max(window.innerHeight * 0.5, 1);
  const transitionProgress = Math.min(
    Math.max((scrolledPastTrackStart - settleDistance) / window.innerHeight, 0),
    1,
  );

  const settleProgress = Math.min(scrolledPastTrackStart / settleDistance, 1);
  const aboutHasSettled =
    trackTop <= 1 || settleProgress >= DETAILS_REVEAL_THRESHOLD;

  isAboutRevealed.value =
    isMobile || (aboutHasSettled && transitionProgress <= 0.001);

  burn?.setProgress(isMobile ? 0 : transitionProgress);
};

const scheduleAboutProgress = () => {
  if (!progressFrameId) {
    progressFrameId = requestAnimationFrame(updateAboutProgress);
  }
};

const handleWaveResize = () => {
  burn?.resize();
  scheduleAboutProgress();
};

const scrollToJourney = () => scrollToSection("journey");

onMounted(() => {
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionPreference.addEventListener("change", handleMotionChange);

  burn = createScrollBurnTransition({
    getCanvas: () => aboutWaveRef.value,
    onClipPath: (value) => {
      aboutClipPath.value = value;
    },
    onProgress: handleBurnProgress,
  });
  burn.resize();

  unregisterStops = registerScrollStops("about", () => {
    const track = aboutTrackRef.value;
    if (!track || window.innerWidth <= MOBILE_BREAKPOINT) return [];

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
        entry.target.classList.toggle("in-view", entry.isIntersecting);
      });
    },
    { threshold: 0.01 },
  );

  if (aboutSectionRef.value) observer.observe(aboutSectionRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener("scroll", scheduleAboutProgress);
  window.removeEventListener("resize", handleWaveResize);
  unregisterStops?.();
  motionPreference?.removeEventListener("change", handleMotionChange);
  if (progressFrameId) cancelAnimationFrame(progressFrameId);
  burn?.destroy();
});
</script>

<style scoped>
/* ===== LAYOUT DASAR ===== */
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
  padding-top: 50px;
  padding-bottom: 100px;
  scroll-margin-top: 80px;
  background: #111820;
  pointer-events: auto;
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
  padding: 0 2rem;
}

/* ===== BACKGROUND: satu wrapper di-zoom, video + overlay menyatu ===== */
.about-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.about-bg-zoom {
  position: absolute;
  inset: 0;
  transform: scale(1);
  transition: transform 1100ms cubic-bezier(0.2, 0.7, 0.2, 1);
  will-change: transform;
}

/* Tiba: zoom-in sekali, sedikit lebih lambat supaya kedatangan terasa tegas */
.about-bg.is-zoomed .about-bg-zoom {
  transform: scale(1.12);
  transition: transform 1600ms cubic-bezier(0.2, 0.7, 0.2, 1) 150ms;
}

.about-video,
.about-video-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.about-video {
  display: block;
  object-fit: cover;
  object-position: center;
  opacity: 0.62;
}

.about-video-overlay {
  background:
    linear-gradient(90deg, rgba(17, 24, 32, 0.55), rgba(17, 24, 32, 0.32)),
    linear-gradient(0deg, rgba(17, 24, 32, 0.52), rgba(17, 24, 32, 0.14));
}

/* ===== KONTEN ===== */
.about-details {
  opacity: 0;
  transform: translateY(2rem) scale(0.94);
  transition:
    opacity 450ms ease-out,
    transform 550ms cubic-bezier(0.2, 0.8, 0.25, 1);
  pointer-events: none;
}

.about-details.is-revealed {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-delay: 250ms;
  pointer-events: auto;
}

.title-block {
  margin-bottom: 4rem;
  text-align: center;
}

.section-kicker {
  margin-bottom: 0.75rem;
  color: var(--pikachu-yellow);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.section-title {
  margin-bottom: 0.5rem;
  color: var(--text-white);
  font-size: 3rem;
  font-weight: 700;
}

.subtitle {
  color: var(--pikachu-yellow);
  font-weight: 500;
}

.intro-flex {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 4rem;
}

.intro-text {
  flex: 1;
}

.intro-text h1 {
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.highlight-name {
  color: var(--pikachu-yellow);
}

.bio {
  margin-bottom: 1.5rem;
  color: rgb(209, 213, 219);
  line-height: 1.7;
}

.quote {
  margin-bottom: 2rem;
  padding: 1rem;
  border-left: 3px solid var(--pikachu-yellow);
  background: rgba(255, 255, 255, 0.03);
  color: rgb(209, 213, 219);
  font-style: italic;
}

.quote .author {
  display: block;
  margin-top: 0.5rem;
  color: var(--pikachu-yellow);
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 600;
}

/* Foto */
.intro-photo {
  position: relative;
  display: flex;
  flex: 1;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  max-width: 350px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 50%;
}

.intro-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px transparent;
  border-radius: 50%;
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

/* Tombol */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn svg {
  width: 1.2rem;
  height: 1.2rem;
}

.btn-primary {
  border: 2px solid var(--pikachu-yellow);
  background: var(--pikachu-yellow);
  color: var(--bg-dark);
}

.btn-primary:hover {
  border-color: #fff;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
  color: #fff;
  transform: translateY(-3px);
}

.btn-secondary {
  border: 2px solid rgb(75, 85, 99);
  background: transparent;
  color: var(--text-white);
}

.btn-secondary:hover {
  border-color: var(--pikachu-yellow);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);
  color: var(--pikachu-yellow);
  transform: translateY(-3px);
}

/* Statistik */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-item {
  position: relative;
  padding: 1.5rem;
  border: 1px solid rgb(75, 85, 99);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item:hover {
  border-color: var(--pikachu-yellow);
  transform: translateY(-5px);
}

.stat-icon-wrapper {
  width: 32px;
  height: 32px;
  margin-bottom: 1rem;
  color: var(--pikachu-yellow);
}

.stat-number {
  display: block;
  color: var(--text-white);
  font-size: 2.5rem;
  font-weight: 700;
}

.stat-title {
  margin-top: 0.5rem;
  color: rgb(209, 213, 219);
  font-weight: 500;
}

.stat-desc {
  color: rgb(156, 163, 175);
  font-size: 0.875rem;
}

.stat-arrow {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  color: var(--pikachu-yellow);
  font-size: 1.2rem;
  transform: rotate(-45deg);
  transition: transform 0.3s ease;
}

.stat-item:hover .stat-arrow {
  transform: rotate(0deg);
}

/* ===== ANIMASI MASUK ITEM ===== */
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

#about.is-content-revealed .title-block .animated-item,
.about-details.is-revealed .animated-item {
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

/* ===== RESPONSIVE ===== */
@media (min-width: 1024px) {
  .bio,
  .quote {
    max-width: 650px;
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

  /* Tanpa transisi burn di layar kecil, jadi tanpa zoom */
  .about-bg-zoom,
  .about-bg.is-zoomed .about-bg-zoom {
    transform: none;
    transition: none;
  }

  .about-video {
    opacity: 0.5;
  }

  .about-video-overlay {
    background:
      linear-gradient(90deg, rgba(17, 24, 32, 0.66), rgba(17, 24, 32, 0.44)),
      linear-gradient(0deg, rgba(17, 24, 32, 0.7), rgba(17, 24, 32, 0.24));
  }

  .about-wave {
    display: none;
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

  .intro-flex {
    flex-direction: column-reverse;
    gap: clamp(1.5rem, 4vw, 3rem);
    text-align: center;
  }

  .intro-text h1 {
    font-size: clamp(1.8rem, 7.5vw, 2.5rem);
    overflow-wrap: anywhere;
  }

  .bio {
    font-size: clamp(0.9rem, 3.8vw, 1.05rem);
  }

  .quote {
    margin-inline: auto;
  }

  .intro-photo {
    width: min(44vw, 250px);
    max-width: 250px;
    margin: 0 auto 1rem;
  }

  .action-buttons {
    justify-content: center;
  }

  .btn {
    min-height: 2.75rem;
    padding: 0.65rem clamp(1rem, 4vw, 1.5rem);
    font-size: clamp(0.9rem, 3.6vw, 1rem);
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .stat-item {
    padding: clamp(1rem, 4vw, 1.5rem);
  }

  .stat-number {
    font-size: clamp(2rem, 8vw, 2.5rem);
  }

  .stat-title {
    font-size: clamp(0.9rem, 3.8vw, 1rem);
  }

  .stat-desc {
    font-size: clamp(0.78rem, 3.3vw, 0.875rem);
  }
}

@media (max-width: 768px) {
  /* Video tidak dimuat sama sekali di HP */
  .about-bg {
    display: none;
  }

  #about {
    background:
      radial-gradient(
        ellipse at 82% 18%,
        rgba(86, 108, 121, 0.2),
        transparent 32rem
      ),
      radial-gradient(
        ellipse at 14% 76%,
        rgba(68, 88, 101, 0.16),
        transparent 28rem
      ),
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

/* ===== REDUCED MOTION (satu blok untuk semuanya) ===== */
@media (prefers-reduced-motion: reduce) {
  .about-bg-zoom,
  .about-bg.is-zoomed .about-bg-zoom {
    transform: none;
    transition: none;
  }

  .about-details,
  .about-details.is-revealed,
  .animated-item {
    transition: none;
  }
}
</style>