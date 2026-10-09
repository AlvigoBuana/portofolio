<template>
  <div ref="homeTrackRef" class="home-scroll-track">
    <section
      id="home"
      ref="homeSectionRef"
      :style="{ clipPath: homeClipPath }"
    >
      <video
        ref="homeVideoRef"
        class="home-video"
        :autoplay="!prefersReducedMotion"
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true"
        tabindex="-1"
        @error="handleHomeVideoError"
      >
        <source src="/AnimatedClip2.mp4" type="video/mp4">
      </video>
      <div class="home-video-overlay" aria-hidden="true"></div>

      <div
        class="content-wrapper home-content"
        :class="{ 'is-revealed': isHomeRevealed }"
        :inert="!isHomeRevealed"
      >
        <div class="home-flex">

          <div class="left-content">
            <p class="section-kicker anim-item anim-up">Independent developer · Indonesia</p>

            <div class="innovation-badge anim-item anim-up">
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Ready to Innovate</span>
            </div>

            <h1 class="main-title anim-item anim-left" style="transition-delay: 0.2s">
              <span class="title-frontend">Frontend</span>
              <span class="title-developer">Developer</span>
            </h1>

            <div class="typing-container anim-item anim-left" style="transition-delay: 0.4s">
              <span class="typing-text">
                {{ currentText }}
                <span class="cursor">|</span>
              </span>
            </div>

            <p class="description anim-item anim-up" style="transition-delay: 0.6s">
              Still learning and exploring the world of web development.
              I'm Alvigo Wahyu Buana, a tech and game enthusiast.
              I like creating innovative Web Development.
              Join me on this journey of discovery and growth.
            </p>

            <div class="tech-stack anim-item anim-up" style="transition-delay: 0.8s">
              <span v-for="tech in techStack" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>

            <div class="action-buttons anim-item anim-up" style="transition-delay: 1.0s">
              <button class="btn-projects" @click="scrollToSection('#journey')">
                <span>Journey</span>
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </button>
              <button class="btn-contact" @click="scrollToSection('#contact')">
                <span>Contact</span>
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </button>
            </div>

            <div class="social-links anim-item anim-up" style="transition-delay: 1.2s">
              <a v-for="social in socialMedia" :key="social.name" :href="social.href" class="social-link" target="_blank" rel="noopener noreferrer">
                <img :src="social.image" :alt="social.name" class="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
    <canvas
      ref="waveCanvasRef"
      class="home-wave"
      aria-hidden="true"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createSteppedScrollController } from '~/utils/steppedScroll.js'

const prefersReducedMotion = ref(false)
const waveCanvasRef = ref(null)
const homeClipPath = ref('none')
const homeTrackRef = ref(null)
const currentText = ref('')
const currentIndex = ref(0)
const isDeleting = ref(false)
const textIndex = ref(0)
const typingInterval = ref(null)

const texts = ['Alvigo Wahyu Buana', 'Tech & Game Enthusiast']
const techStack = ['React', 'Javascript', 'Python', 'TailwindCSS']

const socialMedia = [
  { name: 'github', href: 'https://github.com/AlvigoBuana', image: '/github.svg' },
  { name: 'linkedin', href: 'https://www.linkedin.com/in/alvigo-wahyu-buana-83bb712b6/', image: '/linkedin.svg' },
  { name: 'instagram', href: 'https://instagram.com/alvgwb_', image: '/instagram.svg' }
]

const homeSectionRef = ref(null)
const homeVideoRef = ref(null)
const isHomeRevealed = ref(false)
let observer = null
let motionPreference = null
let waveFrameId = 0
let waveContext = null
let canvasWidth = 0
let canvasHeight = 0
let canvasScale = 1
let stopSteppedScroll = null

const hashNoise = (value) => {
  const result = Math.sin(value * 127.1 + 311.7) * 43758.5453
  return result - Math.floor(result)
}

let burnProgress = 0
let burnAnimationFrameId = 0
let lastBurnFrameTime = 0

const noise = (value, phase) => {
  const shifted = value + phase
  const left = Math.floor(shifted)
  const fraction = shifted - left
  const smoothFraction = fraction * fraction * (3 - 2 * fraction)

  return hashNoise(left) * (1 - smoothFraction) + hashNoise(left + 1) * smoothFraction
}

const getWaterline = (x, baseY, drift, phase) => {
  const shiftedX = x + drift
  const swell = Math.sin(shiftedX * 0.003 + phase * 0.24) * 10
    + Math.sin(shiftedX * 0.009 - phase * 0.17) * 6
  const chop = (noise(shiftedX * 0.018, phase * 0.13) - 0.5) * 28
    + (noise(shiftedX * 0.052, -phase * 0.19) - 0.5) * 22
    + (noise(shiftedX * 0.15, phase * 0.23) - 0.5) * 16
    + (noise(shiftedX * 0.43, -phase * 0.31) - 0.5) * 8

  return baseY + swell + chop
}

const createClipPath = (progress, phase, drift) => {
  const amplitude = Math.sin(progress * Math.PI)
  const segments = Math.ceil(canvasWidth / 5)
  const edge = []
  const baseY = canvasHeight * (1 - progress)

  for (let index = segments; index >= 0; index -= 1) {
    const x = (canvasWidth * index) / segments
    const waterline = getWaterline(x, baseY, drift, phase)
    const y = baseY + (waterline - baseY) * amplitude
    edge.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
  }

  const burnHoles = []
  const holeCount = Math.max(4, Math.round(canvasWidth / 140))
  for (let index = 0; index < holeCount; index += 1) {
    const seed = index * 43.7 + 9.2
    const x = (hashNoise(seed) * canvasWidth + Math.sin(seed + phase * 0.1) * 9 + canvasWidth) % canvasWidth
    const y = getWaterline(x, baseY, drift, phase)
      + (hashNoise(seed + 6.1) - 0.5) * 44 * amplitude
    const radius = (8 + hashNoise(seed + 12.4) * 18) * Math.sqrt(amplitude)
    const vertices = []
    const vertexCount = 8

    for (let vertex = 0; vertex < vertexCount; vertex += 1) {
      const angle = -((vertex / vertexCount) * Math.PI * 2)
      const unevenRadius = radius * (0.72 + hashNoise(seed + vertex * 3.1) * 0.55)
      vertices.push({
        x: x + Math.cos(angle) * unevenRadius,
        y: y + Math.sin(angle) * unevenRadius * 0.7,
      })
    }

    const midpoints = vertices.map((vertex, vertexIndex) => {
      const next = vertices[(vertexIndex + 1) % vertexCount]
      return { x: (vertex.x + next.x) / 2, y: (vertex.y + next.y) / 2 }
    })
    let holePath = `M ${midpoints[vertexCount - 1].x.toFixed(1)} ${midpoints[vertexCount - 1].y.toFixed(1)}`
    vertices.forEach((vertex, vertexIndex) => {
      holePath += ` Q ${vertex.x.toFixed(1)} ${vertex.y.toFixed(1)} ${midpoints[vertexIndex].x.toFixed(1)} ${midpoints[vertexIndex].y.toFixed(1)}`
    })
    burnHoles.push(`${holePath} Z`)
  }

  const path = `M 0 0 H ${canvasWidth.toFixed(1)} L ${edge.join(' L ')} L 0 0 Z ${burnHoles.join(' ')}`
  return `path('${path}')`
}

const resizeWaveCanvas = () => {
  const canvas = waveCanvasRef.value
  if (!canvas) return

  const bounds = canvas.getBoundingClientRect()
  canvasWidth = bounds.width
  canvasHeight = bounds.height
  canvasScale = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = Math.round(canvasWidth * canvasScale)
  canvas.height = Math.round(canvasHeight * canvasScale)
  waveContext = canvas.getContext('2d')
  waveContext?.setTransform(canvasScale, 0, 0, canvasScale, 0, 0)
}

const drawWave = (progress, animationPhase = 0) => {
  const context = waveContext
  if (!context || !canvasWidth || !canvasHeight) return

  context.clearRect(0, 0, canvasWidth, canvasHeight)
  if (progress <= 0) {
    homeClipPath.value = 'none'
    return
  }

  const phase = progress * Math.PI * 8 + animationPhase
  const drift = progress * canvasWidth * 0.24 + animationPhase * 18
  const waterlineY = canvasHeight * (1 - progress)
  const noiseAmount = Math.sin(progress * Math.PI)
  const step = Math.max(2, canvasWidth / 700)
  const points = []

  for (let x = -step; x <= canvasWidth + step; x += step) {
    points.push({
      x,
      y: waterlineY + (getWaterline(x, waterlineY, drift, phase) - waterlineY) * noiseAmount,
    })
  }

  homeClipPath.value = createClipPath(progress, phase, drift)

  context.save()
  context.globalAlpha = noiseAmount
  context.globalCompositeOperation = 'source-over'

  const burnGlow = context.createLinearGradient(0, waterlineY - 100, 0, waterlineY + 100)
  burnGlow.addColorStop(0, 'rgba(9, 11, 14, 0)')
  burnGlow.addColorStop(0.31, 'rgba(9, 11, 14, 0.22)')
  burnGlow.addColorStop(0.48, 'rgba(35, 39, 42, 0.06)')
  burnGlow.addColorStop(0.56, 'rgba(9, 11, 14, 0.16)')
  burnGlow.addColorStop(1, 'rgba(9, 11, 14, 0)')
  context.fillStyle = burnGlow
  context.fillRect(0, waterlineY - 100, canvasWidth, 200)

  for (let layer = 0; layer < 4; layer += 1) {
    context.beginPath()
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index]
      const textureY = point.y + (5 + layer * 7) * noiseAmount
        + Math.sin((point.x + drift * 0.7) * 0.012 + phase * 0.37 + layer) * (2 + layer)
      if (index === 0) context.moveTo(point.x, textureY)
      else context.lineTo(point.x, textureY)
    }

    context.strokeStyle = `rgba(34, 38, 41, ${0.09 - layer * 0.015})`
    context.lineWidth = layer === 0 ? 1 : 0.65
    context.stroke()
  }

  context.restore()
}

const animateBurnEdge = (timestamp) => {
  burnAnimationFrameId = 0
  if (
    burnProgress <= 0 ||
    burnProgress >= 1 ||
    prefersReducedMotion.value
  ) return

  if (timestamp - lastBurnFrameTime >= 40) {
    lastBurnFrameTime = timestamp
    drawWave(burnProgress, timestamp * 0.00022)
  }

  burnAnimationFrameId = requestAnimationFrame(animateBurnEdge)
}

const startBurnAnimation = () => {
  if (
    burnAnimationFrameId ||
    burnProgress <= 0 ||
    burnProgress >= 1 ||
    prefersReducedMotion.value
  ) return

  burnAnimationFrameId = requestAnimationFrame(animateBurnEdge)
}

const updateWaveProgress = () => {
  waveFrameId = 0
  const track = homeTrackRef.value
  if (!track) return

  if (window.innerWidth <= 992) {
    burnProgress = 0
    isHomeRevealed.value = homeSectionRef.value?.classList.contains('in-view') ?? false
    drawWave(0)
    return
  }

  const trackHeight = track.offsetHeight
  const scrollDistance = Math.max(trackHeight - window.innerHeight, 1)
  const trackProgress = Math.min(
    Math.max((trackHeight - track.getBoundingClientRect().bottom) / scrollDistance, 0),
    1,
  )
  burnProgress = trackProgress
  isHomeRevealed.value = trackProgress <= 0.001
  drawWave(burnProgress, performance.now() * 0.00022)
  if (burnProgress > 0 && burnProgress < 1) {
    startBurnAnimation()
  } else if (burnAnimationFrameId) {
    cancelAnimationFrame(burnAnimationFrameId)
    burnAnimationFrameId = 0
  }
};

const scheduleWaveUpdate = () => {
  if (!waveFrameId) {
    waveFrameId = requestAnimationFrame(updateWaveProgress)
  }
}

const handleWaveResize = () => {
  resizeWaveCanvas()
  scheduleWaveUpdate()
}

const updateMotionPreference = () => {
  prefersReducedMotion.value = motionPreference?.matches ?? false

  const video = homeVideoRef.value
  if (!video) return

  if (prefersReducedMotion.value) {
    video.pause()
    isHomeRevealed.value = true
    if (burnAnimationFrameId) {
      cancelAnimationFrame(burnAnimationFrameId)
      burnAnimationFrameId = 0
      drawWave(burnProgress)
    }
  } else {
    video.play().catch((error) => {
      console.warn('Home background video autoplay was prevented.', error)
    })
    startBurnAnimation()
  }
}

const handleHomeVideoError = (event) => {
  const video = event.currentTarget
  console.error('Home background video could not be loaded.', {
    source: video.currentSrc,
    mediaErrorCode: video.error?.code,
    mediaErrorMessage: video.error?.message,
  })
}

// --- Typing Effect ---
const startTyping = () => {
  if (typingInterval.value) clearInterval(typingInterval.value)
  typingInterval.value = setInterval(() => {
    const currentFullText = texts[textIndex.value]
    if (!isDeleting.value) {
      if (currentIndex.value < currentFullText.length) {
        currentText.value = currentFullText.substring(0, currentIndex.value + 1)
        currentIndex.value++
      } else {
        setTimeout(() => { isDeleting.value = true }, 2000)
      }
    } else {
      if (currentIndex.value > 0) {
        currentText.value = currentFullText.substring(0, currentIndex.value - 1)
        currentIndex.value--
      } else {
        isDeleting.value = false
        textIndex.value = (textIndex.value + 1) % texts.length
      }
    }
  }, isDeleting.value ? 50 : 100)
}

const scrollToSection = (selector) => {
  const section = document.querySelector(selector)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

// --- Animation Logic (Replay on Scroll) ---
onMounted(() => {
  startTyping()
  stopSteppedScroll = createSteppedScrollController(() => {
    const track = homeTrackRef.value
    if (!track || window.innerWidth <= 992) return []

    const start = track.getBoundingClientRect().top + window.scrollY
    const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
    return [
      start,
      ...[0.2, 0.5, 0.8, 1].map((progress) => start + distance * progress),
    ]
  })
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotionPreference()
  motionPreference.addEventListener('change', updateMotionPreference)
  resizeWaveCanvas()
  updateWaveProgress()
  window.addEventListener('scroll', scheduleWaveUpdate, { passive: true })
  window.addEventListener('resize', handleWaveResize)

  // Setup Observer
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
      } else {
        entry.target.classList.remove('in-view')
      }

      if (window.innerWidth <= 992) {
        isHomeRevealed.value = entry.isIntersecting
      }
    })
  }, { threshold: 0.1 }) // 10% masuk layar langsung trigger

  if (homeSectionRef.value) {
    observer.observe(homeSectionRef.value)
  }

})

onBeforeUnmount(() => {
  if (typingInterval.value) clearInterval(typingInterval.value)
  stopSteppedScroll?.()
  if (observer) observer.disconnect()
  motionPreference?.removeEventListener('change', updateMotionPreference)
  window.removeEventListener('scroll', scheduleWaveUpdate)
  window.removeEventListener('resize', handleWaveResize)
  if (waveFrameId) cancelAnimationFrame(waveFrameId)
  if (burnAnimationFrameId) cancelAnimationFrame(burnAnimationFrameId)
})

</script>

<style scoped>
/* ===== ANIMATION CLASSES (New) ===== */
/* State Awal: Hidden & Geser */
.anim-item {
  opacity: 0;
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.anim-up { transform: translateY(30px); }
.anim-left { transform: translateX(-50px); }
.anim-right { transform: translateX(50px); }

/* Trigger: State Akhir (Visible & Posisi Normal) */
.home-content.is-revealed .anim-item {
  opacity: 1;
  transform: translate(0, 0);
}

.home-content {
  transition: opacity 650ms ease, transform 650ms cubic-bezier(0.2, 0.8, 0.25, 1);
}

.home-content:not(.is-revealed) {
  opacity: 0;
  transform: translateY(1.25rem);
  pointer-events: none;
}


/* ===== BASE STYLES ===== */
.home-scroll-track {
  position: relative;
  height: 200svh;
  background: #111820;
}

#home {
  position: sticky;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: 100svh;
  padding-top: 80px;
  isolation: isolate;
  background: #100e0a;
}

.home-video,
.home-video-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.home-video {
  z-index: 0;
  object-fit: cover;
  object-position: center;
  opacity: 0.72;
}

.home-video-overlay {
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(9, 8, 6, 0.78), rgba(9, 8, 6, 0.24)),
    linear-gradient(0deg, rgba(9, 8, 6, 0.52), transparent 65%);
}

.content-wrapper {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  z-index: 2;
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
  color: var(--pikachu-yellow);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}

/* Badge */
.innovation-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(240, 220, 171, 0.3);
  background: rgba(16, 14, 10, 0.48);
  backdrop-filter: blur(12px);
  margin-bottom: 1.5rem;
  color: rgb(231, 192, 19);
  font-size: 0.875rem;
  font-weight: 500;
}
.innovation-badge .icon { width: 1rem; height: 1rem; }

/* Typography */
.main-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.8rem, 6vw, 4.5rem);
  font-weight: 400;
  letter-spacing: -0.045em;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.title-frontend { display: block; color: white; }
.title-developer {
  background: linear-gradient(135deg, #f0dcab, #d7b56d, #a77a40);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.typing-container {
  height: 3rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.typing-text { font-size: clamp(1.25rem, 2.7vw, 2rem); font-weight: 500; color: var(--pikachu-yellow); }
.cursor { animation: blink 1s infinite; margin-left: 2px; }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

.description {
  color: #d1d5db;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 36rem;
}

/* Tech Stack */
.tech-stack {
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2.5rem; justify-content: flex-start;
}
.tech-tag {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(240, 220, 171, 0.24);
  background: rgba(16, 14, 10, 0.48);
  backdrop-filter: blur(10px);
  color: #d1d9db;
  font-size: 0.875rem;
  transition: 0.3s;
}
.tech-tag:hover { border-color: var(--pikachu-yellow); color: var(--pikachu-yellow); }

/* Buttons */
.action-buttons {
  display: flex; gap: 1.5rem; margin-bottom: 2.5rem; justify-content: flex-start;
}
.btn-projects, .btn-contact {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600; cursor: pointer;
  transition: 0.3s;
}
.btn-projects {
  background: linear-gradient(135deg, #e3c17c, #aa7939);
  color: white; border: none;
  box-shadow: 0 4px 24px rgba(190, 137, 60, 0.3);
}
.btn-projects:hover { transform: translateY(-3px); box-shadow: 0 6px 28px rgba(190, 137, 60, 0.5); }

.btn-contact {
  background: rgba(16, 14, 10, 0.38);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(243, 239, 228, 0.28);
  color: #f3efe4;
}
.btn-contact:hover { border-color: var(--pikachu-yellow); color: var(--pikachu-yellow); transform: translateY(-3px); }
.btn-icon { width: 1rem; height: 1rem; }

/* Socials */
.social-links {
  display: flex; gap: 1rem; justify-content: flex-start;
}
.social-link {
  width: 3rem; height: 3rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(243, 239, 228, 0.26);
  background: rgba(16, 14, 10, 0.48);
  backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  transition: 0.3s;
}
.social-link:hover { border-color: var(--pikachu-yellow); transform: translateY(-3px); }
.social-icon { width: 1.5rem; height: 1.5rem; filter: brightness(0.8); transition: 0.3s; }
.social-link:hover .social-icon { filter: brightness(1); transform: scale(1.1); }

/* Responsive layout */

/* 1. TABLET / IPAD (Max 1024px) */
@media (max-width: 1024px) {
  .home-flex {
    justify-content: flex-start;
    gap: 0;
  }

  .left-content {
    width: 100%;
    align-items: flex-start;
    text-align: left;
  }

  .main-title { font-size: 3.5rem; }
  .description { max-width: 80%; margin-left: 0; }

}

@media (max-width: 992px) {
  .home-scroll-track {
    height: auto;
  }

  #home {
    position: relative;
    height: auto;
    min-height: 100svh;
    padding: clamp(6rem, 11vh, 7rem) clamp(1.25rem, 5vw, 3rem) clamp(4rem, 8vh, 6rem);
  }

  .home-wave {
    display: none;
  }
}

/* 2. MOBILE (Max 768px) */
@media (max-width: 768px) {
  #home {
    padding: 6rem clamp(1rem, 5vw, 1.5rem) 4rem;
  }

  .main-title { font-size: clamp(2.45rem, 10vw, 3.25rem); }
  .typing-text { font-size: clamp(1.2rem, 5.5vw, 1.5rem); }
  .description { max-width: 100%; }
  .typing-container {
    width: 100%;
    min-height: 3rem;
    height: auto;
  }

  /* Buttons Stack */
  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    align-items: flex-start;
  }

  .btn-projects, .btn-contact {
    width: 100%;
    min-height: 2.75rem;
    justify-content: center;
  }

}

@media (max-width: 768px) and (max-height: 560px) {
  #home {
    padding-block: 5rem 2.5rem;
  }

  .tech-stack {
    margin-bottom: 1.5rem;
  }

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

@media (prefers-reduced-motion: reduce) {
  .home-video {
    display: none;
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