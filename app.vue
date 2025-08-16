<template>
  <WelcomeScreen v-if="showWelcome" @animationFinished="handleWelcomeFinish" />
  <main v-else>
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

// --- LOGIKA WELCOME SCREEN (Tidak Berubah) ---
const showWelcome = ref(true)
const handleWelcomeFinish = () => {
  showWelcome.value = false
}

// --- LOGIKA BARU UNTUK PARTIKEL DINAMIS ---
const particles = ref([]);
const particleRefs = ref([]);
const particleCount = 50; // Jumlah partikel bisa diubah di sini
let animationFrameId = null;

// Fungsi untuk membuat satu partikel dengan properti acak
const createParticle = (index) => {
  particles.value[index] = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 3 + 1, // Ukuran dari 1px hingga 4px
    speed: Math.random() * 0.5 + 0.1, // Kecepatan naik perlahan
    opacity: Math.random() * 0.5 + 0.2 // Opasitas acak
  };
};

// Fungsi utama untuk loop animasi
const animateParticles = () => {
  const scrollY = window.scrollY;

  particles.value.forEach((p, index) => {
    // 1. Gerakan naik perlahan yang konstan
    p.y -= p.speed;

    // 2. Efek parallax saat scroll
    // (angka pengali bisa diubah untuk mengubah "kedalaman")
    const parallaxEffect = scrollY * (p.size / 10); 
    
    // Reset posisi jika keluar dari layar atas
    if (p.y < -10) {
      p.y = window.innerHeight + 10;
      p.x = Math.random() * window.innerWidth;
    }
    
    // Terapkan style ke elemen DOM
    const element = particleRefs.value[index];
    if (element) {
      element.style.width = `${p.size}px`;
      element.style.height = `${p.size}px`;
      element.style.opacity = p.opacity;
      element.style.transform = `translateY(${p.y + parallaxEffect}px) translateX(${p.x}px)`;
    }
  });
  
  animationFrameId = requestAnimationFrame(animateParticles);
};

onMounted(() => {
  setTimeout(() => {
    showWelcome.value = false
  }, 3500)
});

// Jalankan pembuatan partikel setelah welcome screen hilang
watch(showWelcome, (isShowing) => {
  if (!isShowing) {
    nextTick(() => {
      // Buat semua partikel
      for (let i = 0; i < particleCount; i++) {
        createParticle(i);
      }
      // Mulai loop animasi
      animateParticles();
    });
  }
});

onBeforeUnmount(() => {
  // Hentikan loop animasi saat komponen dihancurkan
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>