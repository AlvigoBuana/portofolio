<template>
  <section class="welcome-screen" :class="{ 'fade-out': fadeOut }">
    <div class="welcome-content">
      <div class="icon-row">
        <div
          v-for="(icon, index) in icons"
          :key="index"
          class="icon-wrapper g-fade-in-up"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          <img :src="icon" alt="icon" class="icon" />
        </div>
      </div>

      <h1 class="welcome-title">
        <span class="g-fade-in-left">Welcome</span>
        <span class="g-fade-in-right" :style="{ animationDelay: '0.4s' }">to My Portfolio</span>
      </h1>

      <p class="welcome-link">
        <span>{{ typedText }}</span><span class="cursor">|</span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'

// 1. Definisikan sinyal yang bisa dikirim komponen ini
const emit = defineEmits(['animationFinished'])

// Path ikon dan logika typing tidak berubah
const icons = [
  '/github.svg',
  '/linkedin.svg',
  '/instagram.svg'
]
const typedText = ref('')
const fullText = 'portofolio-alvigowb.vercel.app'
let charIndex = 0
const fadeOut = ref(false)

onMounted(() => {
  const typeInterval = setInterval(() => {
    if (charIndex < fullText.length) {
      typedText.value += fullText.charAt(charIndex)
      charIndex++
    } else {
      clearInterval(typeInterval)
    }
  }, 100)

  // 2. Logika waktu yang disinkronkan
  setTimeout(() => {
    fadeOut.value = true // Ini memicu animasi fade-out (durasi 1 detik)

    // Tunggu animasi selesai (1000ms = 1 detik)
    setTimeout(() => {
      // 3. Kirim sinyal 'animationFinished' ke parent (App.vue)
      emit('animationFinished')
    }, 1000)
  }, 3000) // Mulai proses fade-out setelah 3 detik
})
</script>

<style scoped>
.welcome-screen {
  position: fixed;
  inset: 0;
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 1s ease, visibility 1s ease;
  visibility: visible;
}

.welcome-screen.fade-out {
  opacity: 0;
  visibility: hidden;
}

.welcome-content {
  text-align: center;
  color: #fff;
}

.icon-row {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.icon-wrapper {
  opacity: 0;
}

.icon {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 0 6px var(--pikachu-yellow));
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.welcome-title span {
  display: inline-block;
  /* opacity: 0; sudah dipindahkan ke kelas global */
}

.welcome-title span:nth-child(2) {
  margin-left: 10px;
}

.welcome-link {
  font-size: 1.2rem;
  color: var(--pikachu-yellow);
  margin-top: 0.5rem;
  /* Dihapus: animasi fade-in agar hanya ada efek ketik */
}

.cursor {
  display: inline-block;
  width: 2px;
  background: var(--pikachu-yellow);
  animation: blink 1s infinite;
  animation-delay: 2.2s;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>