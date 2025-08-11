<template>
  <header class="navbar" :class="{ hidden: isHidden, scrolled: isScrolled }">
    <div class="navbar-logo">alvigowb</div>
    <ul class="navbar-links">
      <li><a href="#home" @click="onNavClick('home')" :class="{ active: activeSection === 'home' }">Home</a></li>
      <li><a href="#about" @click="onNavClick('about')" :class="{ active: activeSection === 'about' }">About</a></li>
      <li><a href="#portfolio" @click="onNavClick('portfolio')" :class="{ active: activeSection === 'portfolio' }">Portfolio</a></li>
      <li><a href="#contact" @click="onNavClick('contact')" :class="{ active: activeSection === 'contact' }">Contact</a></li>
    </ul>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const activeSection = ref('home')
const isHidden = ref(false)
const isScrolled = ref(false)
let lastScroll = 0
let isClickScrolling = false

const handleScroll = () => {
  const currentScroll = window.scrollY

  // Active section logic
  const sections = ['home', 'about', 'portfolio', 'contact']
  let current = 'home'
  sections.forEach((id) => {
  const section = document.getElementById(id)
  if (section) {
    const sectionTop = section.offsetTop
    const sectionBottom = sectionTop + section.offsetHeight

    // Active hanya jika posisi scroll berada di antara atas dan bawah section
    if (window.scrollY >= sectionTop - 1 && window.scrollY < sectionBottom - 1) {
      current = id
    }
  }
})

  activeSection.value = current

  // Shadow logic
  isScrolled.value = currentScroll > 0

  // Hide/Show navbar logic
  if (!isClickScrolling) {
    if (currentScroll > lastScroll && currentScroll > 100) {
      isHidden.value = true
    } else {
      isHidden.value = false
    }
  }

  lastScroll = currentScroll
}

const handleLinkClick = () => {
  isClickScrolling = true
  isHidden.value = false
  setTimeout(() => {
    isClickScrolling = false
  }, 800)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', handleLinkClick)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

