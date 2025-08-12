<template>
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
</template>

<script setup>
import '~/assets/styles.css'
import Navbar from '~/components/navbar.vue'
import Home from '~/components/home.vue'
import About from '~/components/about.vue'
import Portfolio from '~/components/portofolio.vue'
import Contact from '~/components/contact.vue'
import Footer from '~/components/footer.vue'
</script>