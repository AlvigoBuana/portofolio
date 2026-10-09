<template>
  <div class="intro-track" :class="{ 'is-ready': isReady }">
    <section
      ref="stageRef"
      class="intro-stage"
      aria-label="Animated introduction"
    >
      <video
        ref="videoRef"
        class="intro-video"
        preload="auto"
        muted
        playsinline
        aria-hidden="true"
        tabindex="-1"
        @loadedmetadata="handleLoadedMetadata"
        @loadeddata="handleLoadedData"
        @seeked="handleSeeked"
        @error="handleVideoError"
      >
        <source src="/AnimatedClip1.mp4" type="video/mp4" />
      </video>

      <div class="intro-overlay" aria-hidden="true"></div>
      <div class="intro-light-leak" aria-hidden="true"></div>
      <div class="intro-grain" aria-hidden="true"></div>

      <p v-if="!isReady && !hasError" class="intro-status" role="status">
        {{
          isLoadingDelayed
            ? "The opening scene is taking longer than expected…"
            : "Preparing the opening scene…"
        }}
      </p>
      <p v-if="hasError" class="intro-status" role="alert">
        The animation could not be loaded.
      </p>

      <button
        v-if="prefersReducedMotion || hasError || isLoadingDelayed"
        class="intro-continue"
        type="button"
        @click="finishIntro"
      >
        Continue to portfolio <span aria-hidden="true">→</span>
      </button>
      <div v-else-if="isReady" class="intro-scroll-cue" aria-hidden="true">
        <span>Scroll to continue</span>
        <span class="intro-scroll-line"></span>
      </div>

      <div
        v-if="isReady && !prefersReducedMotion"
        class="intro-progress"
        aria-hidden="true"
      ></div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits(["finished"]);

const stageRef = ref(null);
const videoRef = ref(null);
const isReady = ref(false);
const hasError = ref(false);
const isLoadingDelayed = ref(false);
const prefersReducedMotion = ref(false);

let duration = 0;
let targetTime = 0;
let scrollProgress = 0;
let scrubDistance = 3000;
let scrubOffset = 0;
let renderedScrubOffset = 0;
let lastFrameTime = 0;
let lastInputTime = 0;
let animationFrameId = 0;
let motionPreference;
let isSeeking = false;
let finished = false;
let touchY = 0;
let previousRootOverflow = "";
let loadingTimeoutId = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const handleLoadedMetadata = (event) => {
  const videoDuration = event.currentTarget.duration;
  if (!Number.isFinite(videoDuration) || videoDuration <= 0) {
    handleVideoError(event, "Opening video has no usable duration.");
    return;
  }

  duration = videoDuration;
  scrubDistance = clamp(videoDuration * 140, 2400, 6000);
};

const handleLoadedData = () => {
  if (hasError.value) return;

  window.clearTimeout(loadingTimeoutId);
  isLoadingDelayed.value = false;
  isReady.value = true;
  scheduleFrameUpdate();
};

const handleVideoError = (event, reason = "Video resource error.") => {
  window.clearTimeout(loadingTimeoutId);
  const video = event.currentTarget;
  console.error("Opening video could not be loaded for scroll scrubbing.", {
    reason,
    source: video.currentSrc,
    mediaErrorCode: video.error?.code,
    mediaErrorMessage: video.error?.message,
  });
  hasError.value = true;
  isReady.value = false;
};

const updateFrameFromScroll = (timestamp) => {
  animationFrameId = 0;

  const video = videoRef.value;
  const stage = stageRef.value;
  if (
    !stage ||
    !video ||
    !isReady.value ||
    !duration ||
    prefersReducedMotion.value
  )
    return;

  const frameDelta = lastFrameTime
    ? Math.min(timestamp - lastFrameTime, 64)
    : 16;
  lastFrameTime = timestamp;

  const inputIsActive = timestamp - lastInputTime < 120;
  const smoothingTime = inputIsActive ? 100 : 190;
  const smoothing = 1 - Math.exp(-frameDelta / smoothingTime);
  const remainingDistance = scrubOffset - renderedScrubOffset;

  renderedScrubOffset += remainingDistance * smoothing;
  if (Math.abs(remainingDistance) < 0.5) {
    renderedScrubOffset = scrubOffset;
  }

  const nextProgress = clamp(renderedScrubOffset / scrubDistance, 0, 1);
  scrollProgress = nextProgress;
  targetTime = nextProgress * Math.max(0, duration - 0.001);
  stage.style.setProperty("--intro-progress", String(nextProgress));
  seekToLatestFrame();

  if (
    nextProgress >= 1 &&
    !video.seeking &&
    Math.abs(video.currentTime - targetTime) < 0.025
  ) {
    finishIntro();
  }

  if (Math.abs(scrubOffset - renderedScrubOffset) >= 0.5) {
    scheduleFrameUpdate();
  } else {
    lastFrameTime = 0;
  }
};

const handleWheel = (event) => {
  if (event.ctrlKey) return;

  event.preventDefault();
  if (!isReady.value || prefersReducedMotion.value || finished) return;

  const unit =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1;

  scrubOffset = clamp(scrubOffset + event.deltaY * unit, 0, scrubDistance);
  lastInputTime = performance.now();
  scheduleFrameUpdate();
};

const handleTouchStart = (event) => {
  touchY = event.touches[0]?.clientY ?? 0;
};

const handleTouchMove = (event) => {
  event.preventDefault();
  const currentY = event.touches[0]?.clientY;
  if (
    !isReady.value ||
    prefersReducedMotion.value ||
    finished ||
    currentY === undefined
  ) {
    touchY = currentY ?? touchY;
    return;
  }

  scrubOffset = clamp(scrubOffset + touchY - currentY, 0, scrubDistance);
  touchY = currentY;
  lastInputTime = performance.now();
  scheduleFrameUpdate();
};

const handleKeyDown = (event) => {
  const scrollKeys = [
    "ArrowDown",
    "ArrowUp",
    "PageDown",
    "PageUp",
    " ",
    "Home",
    "End",
  ];
  if (!scrollKeys.includes(event.key)) return;

  event.preventDefault();
  if (!isReady.value || prefersReducedMotion.value || finished) return;

  const step =
    event.key === "PageDown" || event.key === "PageUp"
      ? window.innerHeight
      : event.key === " "
        ? window.innerHeight * 0.8
        : 120;
  const direction =
    event.key === "ArrowUp" || event.key === "PageUp" || event.key === "Home"
      ? -1
      : 1;

  scrubOffset =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? scrubDistance
        : clamp(scrubOffset + step * direction, 0, scrubDistance);
  lastInputTime = performance.now();
  scheduleFrameUpdate();
};

const seekToLatestFrame = () => {
  const video = videoRef.value;
  if (!video || isSeeking || video.seeking || !isReady.value) return;
  if (Math.abs(video.currentTime - targetTime) < 0.025) return;

  isSeeking = true;
  video.currentTime = targetTime;
};

const handleSeeked = () => {
  isSeeking = false;

  const video = videoRef.value;
  if (!video) return;

  if (Math.abs(video.currentTime - targetTime) >= 0.025) {
    scheduleFrameUpdate();
  } else if (scrollProgress >= 1) {
    finishIntro();
  }
};

const scheduleFrameUpdate = () => {
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(updateFrameFromScroll);
  }
};

const updateMotionPreference = () => {
  prefersReducedMotion.value = motionPreference?.matches ?? false;

  if (prefersReducedMotion.value && videoRef.value) {
    videoRef.value.currentTime = 0;
  } else {
    scheduleFrameUpdate();
  }
};

const finishIntro = () => {
  if (finished) return;
  finished = true;
  document.documentElement.style.overflow = previousRootOverflow;
  emit("finished");
};

onMounted(() => {
  previousRootOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";

  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = motionPreference.matches;
  motionPreference.addEventListener("change", updateMotionPreference);
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("keydown", handleKeyDown);
  loadingTimeoutId = window.setTimeout(() => {
    if (!isReady.value && !hasError.value) {
      isLoadingDelayed.value = true;
    }
  }, 12000);
});

onBeforeUnmount(() => {
  window.clearTimeout(loadingTimeoutId);
  document.documentElement.style.overflow = previousRootOverflow;
  motionPreference?.removeEventListener("change", updateMotionPreference);
  window.removeEventListener("wheel", handleWheel);
  window.removeEventListener("touchstart", handleTouchStart);
  window.removeEventListener("touchmove", handleTouchMove);
  window.removeEventListener("keydown", handleKeyDown);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.intro-track {
  position: relative;
  min-height: 100svh;
  height: 100svh;
  background: #090807;
  overscroll-behavior: none;
}

.intro-stage {
  position: fixed;
  z-index: 1000;
  inset: 0;
  isolation: isolate;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  touch-action: none;
  background:
    radial-gradient(
      ellipse at 72% 36%,
      rgba(140, 94, 43, 0.24),
      transparent 42%
    ),
    linear-gradient(135deg, #100e0a, #18120b 55%, #090807);
}

.intro-video,
.intro-overlay,
.intro-light-leak,
.intro-grain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.intro-video {
  z-index: -3;
  display: block;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  background: #100e0a;
  filter: brightness(0.72) saturate(0.82) contrast(1.06);
  transition: opacity 800ms ease;
}

.intro-track.is-ready .intro-video {
  opacity: 1;
}

.intro-overlay {
  z-index: -2;
  background:
    linear-gradient(
      90deg,
      rgba(9, 8, 6, 0.18),
      transparent 55%,
      rgba(9, 8, 6, 0.14)
    ),
    linear-gradient(
      0deg,
      rgba(9, 8, 6, 0.38),
      transparent 24%,
      rgba(9, 8, 6, 0.12)
    );
}

.intro-light-leak {
  z-index: -1;
  inset: -20%;
  width: 140%;
  height: 140%;
  opacity: 0.64;
  background:
    radial-gradient(
      ellipse at 72% 36%,
      rgba(234, 191, 115, 0.2),
      transparent 24%
    ),
    radial-gradient(
      ellipse at 32% 70%,
      rgba(164, 103, 43, 0.12),
      transparent 32%
    );
  filter: blur(36px);
  mix-blend-mode: screen;
  animation: intro-light-drift 16s ease-in-out infinite alternate;
}

.intro-grain {
  z-index: 0;
  opacity: 0.12;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.035) 0,
    rgba(255, 255, 255, 0.035) 1px,
    transparent 1px,
    transparent 3px
  );
  mask-image: linear-gradient(transparent, #000 18%, #000 82%, transparent);
}

.intro-status {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  color: rgba(243, 239, 228, 0.78);
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-align: center;
  text-transform: uppercase;
  transform: translate(-50%, -50%);
}

.intro-scroll-cue {
  position: absolute;
  z-index: 2;
  right: clamp(1.5rem, 5vw, 4rem);
  bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(243, 239, 228, 0.85);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.intro-scroll-line {
  width: 3rem;
  height: 1px;
  background: var(--pikachu-light);
}

.intro-progress {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #9c7135, var(--pikachu-light));
  transform: scaleX(var(--intro-progress, 0));
  transform-origin: left;
  box-shadow: 0 0 14px rgba(240, 220, 171, 0.65);
}

.intro-continue {
  position: absolute;
  z-index: 2;
  bottom: 2rem;
  left: 50%;
  min-height: 2.75rem;
  padding: 0.65rem clamp(1rem, 5vw, 1.3rem);
  border: 1px solid rgba(240, 220, 171, 0.55);
  border-radius: 999px;
  background: rgba(16, 14, 10, 0.7);
  color: var(--text-white);
  cursor: pointer;
  transform: translateX(-50%);
}

.intro-continue:hover {
  border-color: var(--pikachu-light);
  background: rgba(45, 34, 20, 0.85);
}

@keyframes intro-light-drift {
  from {
    transform: translate3d(-2%, -1%, 0) scale(0.96);
    opacity: 0.48;
  }
  to {
    transform: translate3d(2%, 1%, 0) scale(1.04);
    opacity: 0.72;
  }
}

@media (max-width: 768px) {
  .intro-continue {
    bottom: max(1rem, env(safe-area-inset-bottom));
    max-width: calc(100vw - 2rem);
    font-size: clamp(0.8rem, 3.5vw, 0.95rem);
  }

  .intro-scroll-cue {
    right: auto;
    bottom: 1.5rem;
    left: 1.5rem;
  }
}

@media (max-width: 380px) {
  .intro-scroll-cue { left: 1rem; font-size: 0.62rem; }
  .intro-scroll-line { width: 2rem; }
}

@media (prefers-reduced-motion: reduce) {
  .intro-light-leak {
    animation: none;
  }
  .intro-video {
    transition: none;
  }
}
</style>
