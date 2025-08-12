<template>
  <header class="navbar" :class="{ hidden: isHidden, scrolled: isScrolled }">
    <div class="navbar-logo" @click="onNavClick('home')">alvigowb</div>
    
    <!-- Desktop Menu -->
    <ul class="navbar-links desktop-menu">
      <li><a href="#home" @click="onNavClick('home')" :class="{ active: activeSection === 'home' }">Home</a></li>
      <li><a href="#about" @click="onNavClick('about')" :class="{ active: activeSection === 'about' }">About</a></li>
      <li><a href="#portfolio" @click="onNavClick('portfolio')" :class="{ active: activeSection === 'portfolio' }">Portfolio</a></li>
      <li><a href="#contact" @click="onNavClick('contact')" :class="{ active: activeSection === 'contact' }">Contact</a></li>
    </ul>

    <!-- Mobile Menu Toggle -->
    <div class="mobile-menu-toggle" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ active: isMobileMenuOpen }">
      <ul class="mobile-menu-links">
        <li><a href="#home" @click="onNavClick('home')" :class="{ active: activeSection === 'home' }">Home</a></li>
        <li><a href="#about" @click="onNavClick('about')" :class="{ active: activeSection === 'about' }">About</a></li>
        <li><a href="#portfolio" @click="onNavClick('portfolio')" :class="{ active: activeSection === 'portfolio' }">Portfolio</a></li>
        <li><a href="#contact" @click="onNavClick('contact')" :class="{ active: activeSection === 'contact' }">Contact</a></li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const activeSection = ref('home')
const isHidden = ref(false)
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
let lastScroll = 0
let isClickScrolling = false

const handleScroll = () => {
  const currentScroll = window.scrollY

  // Active section logic
  const sections = ['home', 'about', 'portfolio', 'contact']
  const navbarHeight = 100
  let current = 'home'
  
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i])
    if (section) {
      const sectionTop = section.offsetTop - navbarHeight
      
      if (currentScroll >= sectionTop) {
        current = sections[i]
        break
      }
    }
  }

  activeSection.value = current
  isScrolled.value = currentScroll > 0

  // Hide/Show navbar logic
  if (!isClickScrolling) {
    if (currentScroll > lastScroll && currentScroll > 100) {
      isHidden.value = true
      isMobileMenuOpen.value = false // Close mobile menu saat scroll
    } else {
      isHidden.value = false
    }
  }

  lastScroll = currentScroll
}

const handleLinkClick = () => {
  isClickScrolling = true
  isHidden.value = false
  isMobileMenuOpen.value = false // Close mobile menu after click
  setTimeout(() => {
    isClickScrolling = false
  }, 800)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const onNavClick = (section) => {
  activeSection.value = section
  
  // Scroll ke section yang diklik
  const targetSection = document.getElementById(section)
  if (targetSection) {
    targetSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    })
  }
  
  handleLinkClick()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.querySelectorAll('.navbar-links a, .mobile-menu-links a').forEach(link => {
    link.addEventListener('click', handleLinkClick)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>