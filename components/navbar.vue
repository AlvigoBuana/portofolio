<template>
  <header class="navbar" :class="{ hidden: isHidden, scrolled: isScrolled }">
    <div class="navbar-logo" @click="onNavClick('home')">alvigowb</div>
    
    <!-- Desktop Menu -->
    <ul class="navbar-links desktop-menu">
      <li v-for="(item, index) in menuItems" :key="item.section">
        <a
          :href="'#' + item.section"
          @click="onNavClick(item.section)"
          :class="{ active: activeSection === item.section }"
        >
          {{ item.label }}
        </a>
      </li>
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
        <li
          v-for="(item, index) in menuItems"
          :key="'mobile-' + item.section"
          :style="{ animationDelay: isMobileMenuOpen ? (0.1 * (index + 1)) + 's' : '0s' }"
        >
          <a
            :href="'#' + item.section"
            @click="onNavClick(item.section)"
            :class="{ active: activeSection === item.section }"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const menuItems = [
  { section: 'home', label: 'Home' },
  { section: 'about', label: 'About' },
  { section: 'portofolio', label: 'Portofolio' },
  { section: 'contact', label: 'Contact' }
]

const activeSection = ref('home')
const isHidden = ref(false)
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
let lastScroll = 0
let isClickScrolling = false

const handleScroll = () => {
  const currentScroll = window.scrollY

  // Active section logic
  const navbarHeight = 100
  let current = 'home'
  for (let i = menuItems.length - 1; i >= 0; i--) {
    const section = document.getElementById(menuItems[i].section)
    if (section) {
      const sectionTop = section.offsetTop - navbarHeight
      if (currentScroll >= sectionTop) {
        current = menuItems[i].section
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
      isMobileMenuOpen.value = false
    } else {
      isHidden.value = false
    }
  }

  lastScroll = currentScroll
}

const handleLinkClick = () => {
  isClickScrolling = true
  isHidden.value = false
  isMobileMenuOpen.value = false
  setTimeout(() => {
    isClickScrolling = false
  }, 800)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const onNavClick = (section) => {
  activeSection.value = section
  const targetSection = document.getElementById(section)
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
