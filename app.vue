<template>
  <WelcomeScreen v-if="showWelcome" />
  <main v-else>
    <div class="scroll-particle-container">
      <div class="particle" ref="p1"><div></div></div>
      <div class="particle" ref="p2"><div></div></div>
      <div class="particle" ref="p3"><div></div></div>
      <div class="particle" ref="p4"><div></div></div>
    </div>
    
    <Navbar />
    <Home />
    <About />
    <Portfolio />
    <Contact />
    <Footer />
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import '~/assets/styles.css'

import WelcomeScreen from '~/components/welcome.vue'
import Navbar from '~/components/navbar.vue'
import Home from '~/components/home.vue'
import About from '~/components/about.vue'
import Portfolio from '~/components/portofolio.vue'
import Contact from '~/components/contact.vue'
import Footer from '~/components/footer.vue'

// --- LOGIKA WELCOME SCREEN ---
const showWelcome = ref(true)

// --- LOGIKA PARALLAX PARTICLE ---
const p1 = ref(null)
const p2 = ref(null)
const p3 = ref(null)
const p4 = ref(null)

const handleScroll = () => {
  const scrollY = window.scrollY;
  if (p1.value && p2.value && p3.value && p4.value) {
    p1.value.style.transform = `translateY(${scrollY * 0.5}px)`;
    p2.value.style.transform = `translateY(${scrollY * -0.2}px) rotate(${scrollY * -0.05}deg)`;
    p3.value.style.transform = `translateY(${scrollY * 0.8}px)`;
    p4.value.style.transform = `translateX(${scrollY * 0.1}px) translateY(${scrollY * 0.25}px)`;
  }
}

watch(showWelcome, (isShowing) => {
  if (!isShowing) {
    nextTick(() => {
      if (p1.value && p2.value && p3.value && p4.value) {
        p1.value.style.cssText = `top: 20%; left: 80%; width: 8px; height: 8px; opacity: 0.8;`;
        p2.value.style.cssText = `top: 70%; left: 10%; width: 4px; height: 4px; opacity: 0.5;`;
        p3.value.style.cssText = `top: 40%; left: 90%; width: 12px; height: 12px; opacity: 1;`;
        p4.value.style.cssText = `top: 90%; left: 30%; width: 6px; height: 6px; opacity: 0.7;`;
      }
    });
  }
});

onMounted(() => {
  setTimeout(() => {
    showWelcome.value = false
  }, 3500)
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>