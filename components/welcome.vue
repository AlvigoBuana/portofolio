<template>
  <section class="welcome-screen" :class="{ 'fade-out': fadeOut }">
    <video
      ref="backgroundVideoRef"
      class="welcome-video"
      :autoplay="!prefersReducedMotion"
      muted
      playsinline
      preload="auto"
      aria-hidden="true"
      tabindex="-1"
      @playing="handleVideoPlaying"
      @loadedmetadata="handleVideoMetadata"
      @ended="finish"
      @error="handleVideoError"
    >
      <source src="/welcome1.mp4" type="video/mp4">
    </video>
    <div class="welcome-video-overlay" aria-hidden="true"></div>

    <div class="welcome-content">
      <div class="icon-row">
        <div
          v-for="(icon, index) in icons"
          :key="icon"
          class="icon-wrapper enter enter-up"
          :class="{ 'is-in': showIcons }"
          :style="{ transitionDelay: `${index * 0.15}s` }"
        >
          <img :src="icon" alt="icon" class="icon" />
        </div>
      </div>

      <h1 class="welcome-title">
        <span class="enter enter-left" :class="{ 'is-in': showTitleLeft }">Welcome</span>
        <span class="enter enter-right" :class="{ 'is-in': showTitleRight }">to My Portfolio</span>
      </h1>

      <p class="welcome-link enter enter-up" :class="{ 'is-in': showLink }">
        <span>{{ typedText }}</span><span class="cursor">|</span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['animationFinished'])

// --- Pengaturan timeline ---
const FALLBACK_DURATION = 5      // dipakai kalau video tidak bisa diputar
const REDUCED_DURATION = 3       // durasi singkat untuk prefers-reduced-motion
const FADE_SECONDS = 1           // lama fade-out di akhir (samakan dengan transition CSS)
const VIDEO_START_TIMEOUT = 1500 // tunggu video mulai main sebelum pakai timer cadangan (ms)

// Waktu kemunculan, dalam persen dari "jendela konten" (durasi video - fade-out)
const AT = {
  icons: 0.05,
  titleLeft: 0.2,
  titleRight: 0.32,
  link: 0.5,       // URL mulai diketik
  typeEnd: 0.92,   // URL selesai diketik
}

const backgroundVideoRef = ref(null)
const prefersReducedMotion = ref(false)
const icons = ['/github.svg', '/linkedin.svg', '/instagram.svg']
const typedText = ref('')
const fullText = 'portofolio-alvigowb.vercel.app'
const fadeOut = ref(false)

const showIcons = ref(false)
const showTitleLeft = ref(false)
const showTitleRight = ref(false)
const showLink = ref(false)

let clock = 'pending' // 'pending' | 'video' | 'timer'
let started = false
let finished = false
let timerStart = 0
let rafId = 0
let startTimeoutId = 0
let safetyTimeoutId = 0
let finishTimeoutId = 0
let motionPreference = null

const getDuration = () => {
  const video = backgroundVideoRef.value
  if (clock === 'video' && video && Number.isFinite(video.duration)) {
    return video.duration
  }
  return prefersReducedMotion.value ? REDUCED_DURATION : FALLBACK_DURATION
}

const getElapsed = () => {
  const video = backgroundVideoRef.value
  if (clock === 'video' && video) return video.currentTime
  return (performance.now() - timerStart) / 1000
}

const revealAll = () => {
  showIcons.value = true
  showTitleLeft.value = true
  showTitleRight.value = true
  showLink.value = true
  typedText.value = fullText
}

const finish = () => {
  if (finished) return
  finished = true
  cancelAnimationFrame(rafId)
  window.clearTimeout(safetyTimeoutId)

  const alreadyFading = fadeOut.value
  fadeOut.value = true
  finishTimeoutId = window.setTimeout(
    () => emit('animationFinished'),
    alreadyFading ? 0 : FADE_SECONDS * 1000,
  )
}

const tick = () => {
  if (finished) return

  const elapsed = getElapsed()
  const duration = getDuration()
  const windowLength = Math.max(duration - FADE_SECONDS, 0.5)

  // Kemunculan tiap elemen mengikuti jam video
  if (!showIcons.value && elapsed >= windowLength * AT.icons) showIcons.value = true
  if (!showTitleLeft.value && elapsed >= windowLength * AT.titleLeft) showTitleLeft.value = true
  if (!showTitleRight.value && elapsed >= windowLength * AT.titleRight) showTitleRight.value = true
  if (!showLink.value && elapsed >= windowLength * AT.link) showLink.value = true

  // Typing: kecepatan dihitung supaya URL selesai tepat di AT.typeEnd
  const typeStart = windowLength * AT.link
  const typeSpan = Math.max(windowLength * (AT.typeEnd - AT.link), 0.1)
  const progress = Math.min(Math.max((elapsed - typeStart) / typeSpan, 0), 1)
  const next = fullText.slice(0, Math.floor(progress * fullText.length))
  if (next !== typedText.value) typedText.value = next

  if (!fadeOut.value && elapsed >= duration - FADE_SECONDS) {
    typedText.value = fullText // pastikan URL lengkap sebelum fade
    fadeOut.value = true
  }

  if (elapsed >= duration) {
    finish()
    return
  }

  rafId = requestAnimationFrame(tick)
}

const begin = (source) => {
  if (started) return
  started = true
  clock = source
  timerStart = performance.now()
  window.clearTimeout(startTimeoutId)

  // Jaga-jaga kalau video macet total di tengah jalan
  safetyTimeoutId = window.setTimeout(finish, (getDuration() + 3) * 1000)
  rafId = requestAnimationFrame(tick)
}

const handleVideoPlaying = () => begin('video')

const updateMotionPreference = () => {
  prefersReducedMotion.value = motionPreference?.matches ?? false
  const video = backgroundVideoRef.value
  if (!video) return

  if (prefersReducedMotion.value) {
    video.pause()
  } else {
    video.play().catch((error) => {
      console.warn('Welcome background video autoplay was prevented.', error)
    })
  }
}

const handleVideoError = (event) => {
  const video = event.currentTarget
  console.error('Welcome background video could not be loaded.', {
    source: video.currentSrc,
    mediaErrorCode: video.error?.code,
    mediaErrorMessage: video.error?.message,
  })
  begin('timer') // video gagal, tetap lanjutkan dengan timer
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotionPreference()
  motionPreference.addEventListener('change', updateMotionPreference)

  if (prefersReducedMotion.value) {
    revealAll()
    begin('timer')
  } else {
    // Kalau video tidak mulai main dalam 1,5 detik (autoplay diblokir, dll), pakai timer
    startTimeoutId = window.setTimeout(() => begin('timer'), VIDEO_START_TIMEOUT)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.clearTimeout(startTimeoutId)
  window.clearTimeout(safetyTimeoutId)
  window.clearTimeout(finishTimeoutId)
  motionPreference?.removeEventListener('change', updateMotionPreference)
})
</script>

<style scoped>
.welcome-screen {
  position: fixed;
  top: 0;
  left: 0;
  /* Memaksa elemen mengambil 100% lebar & tinggi dari layar asli device */
  width: 100vw;
  height: 100vh;
  /* 100dvh sangat ampuh untuk mobile browser agar tidak terpotong address bar Chrome/Safari */
  height: 100dvh;
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 1s ease, visibility 1s ease;
  visibility: visible;
  /* Mencegah scrollbar muncul tiba-tiba saat animasi */
  overflow: hidden;
}

.welcome-video,
.welcome-video-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.welcome-video {
  z-index: 0;
  object-fit: cover;
  object-position: center;
  opacity: 0.58;
}

.welcome-video-overlay {
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(10, 10, 10, 0.72), rgba(10, 10, 10, 0.34)),
    linear-gradient(0deg, rgba(10, 10, 10, 0.72), rgba(10, 10, 10, 0.18));
}

.welcome-screen.fade-out {
  opacity: 0;
  visibility: hidden;
}

.welcome-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  padding: 0 1.5rem;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
}

.icon-row {
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 4vw, 1.5rem);
  margin-bottom: clamp(1rem, 4vw, 1.5rem);
}

/* Animasi masuk: dipicu oleh jam video lewat class .is-in */
.enter {
  opacity: 0;
  transition:
    opacity 0.7s cubic-bezier(0.22, 0.8, 0.3, 1),
    transform 0.7s cubic-bezier(0.22, 0.8, 0.3, 1);
  will-change: opacity, transform;
}
.enter-up { transform: translateY(18px); }
.enter-left { transform: translateX(-40px); }
.enter-right { transform: translateX(40px); }
.enter.is-in {
  opacity: 1;
  transform: none;
}

.icon {
  width: clamp(30px, 8vw, 45px);
  height: clamp(30px, 8vw, 45px);
  filter: drop-shadow(0 0 6px var(--pikachu-yellow));
}

.welcome-title {
  /* Ukuran diturunkan sedikit untuk mobile agar lebih proporsional */
  font-size: clamp(1.5rem, 5vw + 0.5rem, 3rem);
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.4;
  /* Diubah menjadi flex agar saat turun baris di tablet/HP tetap simetris di tengah */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem; /* Menjaga jarak antar kata "Welcome" dan "to My Portfolio" */
}

.welcome-title span {
  display: inline-block;
}

.welcome-title span:nth-child(2) {
  /* Margin kiri manual dihapus karena sudah di-handle oleh gap di .welcome-title */
  margin-left: 0;
}

.welcome-link {
  font-size: clamp(0.85rem, 3vw + 0.5rem, 1.2rem);
  color: var(--pikachu-yellow);
  margin-top: 0.5rem;
  padding: 0 0.5rem;
  /* Menggunakan overflow-wrap agar URL panjang patah ke bawah tanpa merusak layout luar */
  overflow-wrap: break-word;
}

.cursor {
  display: inline-block;
  width: 2px;
  background: var(--pikachu-yellow);
  animation: blink 1s infinite;
  vertical-align: middle;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .welcome-video {
    display: none;
  }
  .enter {
    transition: none;
  }
}
</style>