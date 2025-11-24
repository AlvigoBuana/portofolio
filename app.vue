<template>
  <Transition name="fade" mode="out-in">
    <WelcomeScreen v-if="showWelcome" @animationFinished="handleWelcomeFinish" />

    <main v-else class="relative w-full overflow-hidden">
      <div class="scroll-particle-container">
        <div
          v-for="(particle, index) in particles"
          :key="index"
          class="particle"
          :ref="el => particleRefs[index] = el"
        >
          <div></div>
        </div>
      </div>

      <Navbar />
      <Home />
      <About />

      <LazyPortfolio />
      <LazyContact />
      <LazyFooter />

      <SpeedInsights />
    </main>
  </Transition>
</template>

<script setup>
useHead({
  title: 'Alvigo Wahyu Buana | Frontend Developer',
  meta: [
    { name: 'description', content: 'Portfolio website of Alvigo Wahyu Buana. Frontend Developer specializing in Vue, Nuxt, and modern web technologies.' },
    { property: 'og:title', content: 'Alvigo WB - Portfolio' },
    { property: 'og:description', content: 'Check out my latest projects and skills.' },
    { property: 'og:image', content: 'https://alvigowb.com/preview-image.png' }, // Ganti link gambar preview kalau ada
    { property: 'og:type', content: 'website' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})
import { ref, watch, nextTick, defineAsyncComponent, onBeforeUnmount } from 'vue'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
import '~/assets/styles.css'

// === IMPORT MANUAL (Komponen Layar Awal) ===
import WelcomeScreen from '~/components/welcome.vue'
import Navbar from '~/components/navbar.vue'
import Home from '~/components/home.vue'
import About from '~/components/about.vue'

// === LAZY LOAD (Optimasi Loading) ===
// Ganti nama file di dalam import() sesuai nama file asli abang
const LazyPortfolio = defineAsyncComponent(() => import('~/components/portofolio.vue'))
const LazyContact = defineAsyncComponent(() => import('~/components/contact.vue'))
const LazyFooter = defineAsyncComponent(() => import('~/components/footer.vue'))

// --- LOGIC WELCOME ---
const showWelcome = ref(true)
const handleWelcomeFinish = () => {
  showWelcome.value = false
}

// --- LOGIC PARTIKEL (OPTIMIZED) ---
const particles = ref([])
const particleRefs = ref([])
let animationFrameId = null

const createParticle = (index) => {
  if (typeof window === 'undefined') return

  particles.value[index] = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 3 + 1,      // Ukuran random 1px - 4px
    speed: Math.random() * 0.5 + 0.1, // Kecepatan random
    opacity: Math.random() * 0.5 + 0.2
  }
}

const animateParticles = () => {
  if (typeof window === 'undefined') return

  const scrollY = window.scrollY

  particles.value.forEach((p, index) => {
    // 1. Gerakan ke atas terus menerus
    p.y -= p.speed

    // 2. Parallax Effect (Naik lebih cepat pas discroll)
    const parallaxEffect = scrollY * (p.size / 15)

    // 3. Reset posisi kalau lewat atas layar
    if (p.y < -10) {
      p.y = window.innerHeight + 10
      p.x = Math.random() * window.innerWidth
    }

    // 4. Render ke DOM (Pakai translate3d biar GPU yang kerja)
    const element = particleRefs.value[index]
    if (element) {
      element.style.transform = `translate3d(${p.x}px, ${p.y + parallaxEffect}px, 0)`
      // Set style statis (sekali aja sebenernya cukup, tapi gpp buat safety)
      element.style.width = `${p.size}px`
      element.style.height = `${p.size}px`
      element.style.opacity = p.opacity
    }
  })

  animationFrameId = requestAnimationFrame(animateParticles)
}

// Watcher: Jalanin partikel HANYA setelah Welcome Screen kelar
watch(showWelcome, (isShowing) => {
  if (!isShowing) {
    nextTick(() => {
      // --- LOGIC JUMLAH PARTIKEL ---
      const width = window.innerWidth;
      let count = 20; // Default HP (Ringan)

      if (width >= 1024) {
        count = 60; // PC/Laptop (Rame)
      } else if (width >= 768) {
        count = 35; // Tablet (Sedang)
      }

      // Generate partikel sesuai jumlah di atas
      for (let i = 0; i < count; i++) {
        createParticle(i)
      }

      // Mulai Animasi
      animateParticles()
    })
  }
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style>
/* STYLE GLOBAL PARTIKEL (Wajib ada biar posisinya bener) */
.scroll-particle-container {
  position: fixed; /* Fixed biar background diem pas discroll */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Di belakang konten */
  pointer-events: none; /* Biar klik tembus */
}

.particle {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform; /* Memberitahu browser ini bakal gerak (Optimasi) */
}

/* Transisi Halaman Welcome -> Main */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>