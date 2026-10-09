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

const emit = defineEmits(['animationFinished'])

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

  setTimeout(() => {
    fadeOut.value = true

    setTimeout(() => {
      emit('animationFinished')
    }, 1000)
  }, 3000)
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

.welcome-screen.fade-out {
  opacity: 0;
  visibility: hidden;
}

.welcome-content {
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

.icon-wrapper {
  opacity: 0;
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
  animation-delay: 2.2s;
  vertical-align: middle;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>