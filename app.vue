<template>
  <WelcomeScreen v-if="showWelcome" />
  <main v-else>
    <!-- Background Elements -->
    <div class="bg-layer"></div>
    <div class="geometric-bg"></div>
    <div class="scan-line"></div>
    
    <!-- Main Content -->
    <Navbar />
    <Home />
    <About />
    <Portfolio />
    <Contact />
    <Footer />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '~/assets/styles.css'

import WelcomeScreen from '~/components/welcome.vue'
import Navbar from '~/components/navbar.vue'
import Home from '~/components/home.vue'
import About from '~/components/about.vue'
import Portfolio from '~/components/portofolio.vue'
import Contact from '~/components/contact.vue'
import Footer from '~/components/footer.vue'

const showWelcome = ref(true)

onMounted(() => {
  setTimeout(() => {
    showWelcome.value = false
  }, 3500) // sama kayak durasi fade out WelcomeScreen
})
</script>
