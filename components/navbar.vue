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

const menuItems = [
  { section: 'home', label: 'Home' },
  { section: 'about', label: 'About' },
  { section: 'portofolio', label: 'Portfolio' },
  { section: 'contact', label: 'Contact' }
]

const activeSection = ref('home')
const isHidden = ref(false)
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const navbarRef = ref(null)

let lastScrollY = 0
let isClickScrolling = false
let navbarHeight = 80

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
  if (isClickScrolling) return

  const currentScroll = window.scrollY

  if (currentScroll > lastScrollY && currentScroll > 100) {
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
  isClickScrolling = true
  isMobileMenuOpen.value = false
  activeSection.value = sectionId

  const element = document.getElementById(sectionId)
  if (element) {
    const topPos = element.getBoundingClientRect().top + window.scrollY - 20
    window.scrollTo({ top: topPos, behavior: 'smooth' })
  }

  setTimeout(() => { isClickScrolling = false }, 1000)
}

onMounted(() => {
  if (navbarRef.value) { navbarHeight = navbarRef.value.offsetHeight }
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => { window.removeEventListener('scroll', handleScroll) })
</script>

<style scoped>
/* Navbar Utama */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  padding: 1rem 3rem;
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(14, 14, 14, 0.4);
  backdrop-filter: blur(10px); /* Ini biang keroknya tadi */
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
  font-size: 1.5rem; font-weight: bold; cursor: pointer;
  transition: transform 0.2s ease; color: var(--text-white);
}
.navbar-logo:hover { transform: scale(1.05); }

.navbar-links { list-style: none; display: flex; gap: 2.5rem; }
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
  .navbar { padding: 1rem 1.5rem; }
  .navbar-links { display: none; }
  .navbar-logo { font-size: 1.3rem; }

  .mobile-menu-toggle {
    display: flex; flex-direction: column; cursor: pointer; z-index: 1002;
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
    position: fixed; inset: 0; /* Full Screen Aman */
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 2000; /* Di atas Navbar (1000) */
  }
  .mobile-backdrop.active { opacity: 1; pointer-events: all; }

  /* SIDEBAR (Sekarang di luar header) */
  .mobile-sidebar {
    display: flex; flex-direction: column; justify-content: center;
    position: fixed;
    top: 0; right: 0; bottom: 0; /* Full Height Aman */
    width: 75%; max-width: 300px;
    background: rgba(18, 18, 18, 0.253); /* Opacity tinggi biar ga transparan bgt */
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2001; /* Paling atas */
    box-shadow: -5px 0 20px rgba(0,0,0,0.5);
  }
  .mobile-sidebar.active { transform: translateX(0); }

  .mobile-menu-links { list-style: none; text-align: center; padding: 0; margin: 0; }
  .mobile-menu-links li {
    margin: 1.5rem 0; opacity: 0; transform: translateX(20px); transition: all 0.4s ease;
  }
  .mobile-sidebar.active .mobile-menu-links li { opacity: 1; transform: translateX(0); }

  .mobile-menu-links a {
    font-size: 1.5rem; font-weight: 700; text-decoration: none;
    color: var(--text-white); display: block; padding: 0.5rem 1rem;
  }
  .mobile-menu-links a.active { color: var(--pikachu-yellow); }
}
</style>