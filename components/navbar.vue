<template>
  <header
    class="navbar"
    :class="{ hidden: isHidden, scrolled: isScrolled }"
    ref="navbarRef"
  >
    <div class="navbar-logo loading-text" @click="onNavClick('home')">
      alvigowb
    </div>

    <ul class="navbar-links desktop-menu">
      <li v-for="item in menuItems" :key="item.section">
        <a
          :href="'#' + item.section"
          @click.prevent="onNavClick(item.section)"
          :class="{ active: activeSection === item.section }"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>

    <div
      class="mobile-menu-toggle"
      @click="toggleMobileMenu"
      :class="{ active: isMobileMenuOpen }"
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  </header>

  <div
    class="mobile-backdrop"
    :class="{ active: isMobileMenuOpen }"
    @click="isMobileMenuOpen = false"
  ></div>

  <div class="mobile-sidebar" :class="{ active: isMobileMenuOpen }">
    <ul class="mobile-menu-links">
      <li
        v-for="(item, index) in menuItems"
        :key="'mobile-' + item.section"
        :style="{ transitionDelay: isMobileMenuOpen ? (0.1 * (index + 1)) + 's' : '0s' }"
      >
        <a
          :href="'#' + item.section"
          @click.prevent="onNavClick(item.section)"
          :class="{ active: activeSection === item.section }"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { scrollToSection } from '~/utils/navigation.js'

const menuItems = [
  { section: 'home', label: 'Home' },
  { section: 'about', label: 'About' },
  { section: 'journey', label: 'Journey' },
  { section: 'contact', label: 'Contact' }
]

const activeSection = ref('home')
const isHidden = ref(false)
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const navbarRef = ref(null)

let lastScrollY = 0
let navbarHeight = 80
let navigationTimeoutId = 0
let isProgrammaticNavigation = false

const throttle = (fn, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  }
}

const handleScroll = throttle(() => {
  const currentScroll = window.scrollY

  if (isProgrammaticNavigation) {
    isHidden.value = false
  } else if (currentScroll > lastScrollY && currentScroll > 100) {
    isHidden.value = true
    isMobileMenuOpen.value = false
  } else {
    isHidden.value = false
  }

  isScrolled.value = currentScroll > 50
  lastScrollY = currentScroll

  for (const item of menuItems) {
    const element = document.getElementById(item.section)
    if (element) {
      const rect = element.getBoundingClientRect()
      const offset = navbarHeight + 100
      if (rect.top <= offset && rect.bottom >= offset) {
        activeSection.value = item.section
      }
    }
  }
}, 100)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const onNavClick = (sectionId) => {
  isMobileMenuOpen.value = false
  activeSection.value = sectionId

  const topPosition = scrollToSection(sectionId)
  if (topPosition === null) return

  isHidden.value = false
  isScrolled.value = topPosition > 50
  lastScrollY = topPosition
}

// Navbar jangan menghilang selama scroll programatik, dari tombol mana pun
const handlePortfolioNavigate = () => {
  window.clearTimeout(navigationTimeoutId)
  isProgrammaticNavigation = true
  isHidden.value = false
  navigationTimeoutId = window.setTimeout(() => {
    isProgrammaticNavigation = false
  }, 1500)
}

onMounted(() => {
  if (navbarRef.value) { navbarHeight = navbarRef.value.offsetHeight }
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('portfolio:navigate', handlePortfolioNavigate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('portfolio:navigate', handlePortfolioNavigate)
  window.clearTimeout(navigationTimeoutId)
})
</script>

<style scoped>
/* Navbar Utama */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  padding: 1rem clamp(1rem, 4vw, 3rem);
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(14, 14, 14, 0.4);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 1000;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}
.navbar.hidden { transform: translateY(-100%); }
.navbar.scrolled {
  background: rgba(14, 14, 14, 0.85);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.navbar-logo {
  font-size: clamp(1.15rem, 2vw, 1.5rem); font-weight: bold; cursor: pointer;
  transition: transform 0.2s ease; color: var(--text-white);
}
.navbar-logo:hover { transform: scale(1.05); }

.navbar-links { list-style: none; display: flex; gap: clamp(1.25rem, 3vw, 2.5rem); }
.navbar-links a {
  text-decoration: none; font-size: 1rem; color: #f5f5f5;
  transition: all 0.3s ease; position: relative;
}
.navbar-links a:hover { color: var(--neon-blue); text-shadow: 0 0 5px var(--neon-blue); }
.navbar-links a.active { color: var(--pikachu-yellow); text-shadow: 0 0 5px var(--pikachu-yellow); }

.mobile-menu-toggle { display: none; }

/* Sidebar & Backdrop Default State */
.mobile-backdrop, .mobile-sidebar { display: none; }

/* MEDIA QUERY */
@media (max-width: 768px) {
  .navbar { padding: 0.75rem clamp(1rem, 4vw, 1.5rem); }
  .navbar-links { display: none; }

  .mobile-menu-toggle {
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    width: 44px; height: 44px; cursor: pointer; z-index: 1002;
  }
  .mobile-menu-toggle span {
    width: 25px; height: 3px; background: var(--pikachu-yellow);
    margin: 3px 0; transition: all 0.3s ease; border-radius: 2px;
  }
  .mobile-menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(7px, 7px); }
  .mobile-menu-toggle.active span:nth-child(2) { opacity: 0; }
  .mobile-menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(6px, -6px); }

  /* BACKDROP (Sekarang di luar header) */
  .mobile-backdrop {
    display: block;
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 2000;
  }
  .mobile-backdrop.active { opacity: 1; pointer-events: all; }

  /* SIDEBAR (Sekarang di luar header) */
  .mobile-sidebar {
    display: flex; flex-direction: column; justify-content: center;
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: min(82vw, 300px);
    background: rgba(18, 18, 18, 0.92);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2001;
    box-shadow: -5px 0 20px rgba(0,0,0,0.5);
  }
  .mobile-sidebar.active { transform: translateX(0); }

  .mobile-menu-links { list-style: none; text-align: center; padding: 0; margin: 0; }
  .mobile-menu-links li {
    margin: clamp(0.75rem, 4vh, 1.5rem) 0; opacity: 0; transform: translateX(20px); transition: all 0.4s ease;
  }
  .mobile-sidebar.active .mobile-menu-links li { opacity: 1; transform: translateX(0); }

  .mobile-menu-links a {
    font-size: clamp(1.25rem, 6vw, 1.5rem); font-weight: 700; text-decoration: none;
    color: var(--text-white); display: block; padding: 0.75rem 1rem;
  }
  .mobile-menu-links a.active { color: var(--pikachu-yellow); }
}

@media (max-width: 380px) {
  .navbar-logo { font-size: 1.1rem; }
}
</style>