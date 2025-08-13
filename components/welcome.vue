<template>
  <section class="welcome-screen" :class="{ 'fade-out': fadeOut }">
    <div class="welcome-content">
      <!-- Icons -->
      <div class="icon-row">
        <div v-for="(icon, index) in icons" :key="index" class="icon-wrapper" :style="{ animationDelay: `${index * 0.2}s` }">
          <img :src="icon" alt="icon" class="icon" />
        </div>
      </div>

      <!-- Title -->
      <h1 class="welcome-title">
        <span class="fade-left">Welcome</span>
        <span class="fade-right">to My Portfolio</span>
      </h1>

      <!-- Typing Link -->
      <p class="welcome-link">
        <span>{{ typedText }}</span><span class="cursor">|</span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Icons (sesuaikan path-nya)
const icons = [
  '/github.svg',
  '/linkedin.svg',
  '/instagram.svg'
]
const props = defineProps({
  startAnimation: { type: Boolean, default: false }
})

const typedText = ref('')
const fullText = 'www.alvigowb.com'
let charIndex = 0
const fadeOut = ref(false)

watch(() => props.startAnimation, (newVal) => {
  if (newVal) {
    document.querySelectorAll('.fade-in').forEach(el => {
      el.style.animationPlayState = 'running'
    })
  }
})
onMounted(() => {
  // Typing effect
  const typeInterval = setInterval(() => {
    if (charIndex < fullText.length) {
      typedText.value += fullText.charAt(charIndex)
      charIndex++
    } else {
      clearInterval(typeInterval)
    }
  }, 100)

  // Auto fade out sesuai durasi
  setTimeout(() => {
    fadeOut.value = true
  }, 3000)
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
  transition: opacity 1s ease;
}

.welcome-screen.fade-out {
  opacity: 0;
  pointer-events: none;
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
  transform: translateY(-20px);
  animation: fadeInUp 0.6s forwards;
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

.fade-left {
  display: inline-block;
  opacity: 0;
  transform: translateX(-30px);
  animation: fadeInLeft 0.8s forwards;
}

.fade-right {
  display: inline-block;
  margin-left: 10px;
  opacity: 0;
  transform: translateX(30px);
  animation: fadeInRight 0.8s forwards;
  animation-delay: 0.2s;
}

.welcome-link {
  font-size: 1.2rem;
  color: var(--pikachu-yellow);
  margin-top: 0.5rem;
}

.cursor {
  display: inline-block;
  width: 2px;
  background: var(--pikachu-yellow);
  animation: blink 1s infinite;
}

/* Animations */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
  animation-play-state: paused; /* awalnya pause */
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
