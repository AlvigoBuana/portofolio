<template>
  <header class="navbar" :class="{ hidden: isHidden, scrolled: isScrolled }" ref="navbarRef">
    <div class="navbar-logo loading-text" @click="onNavClick('home')">alvigowb</div>
    
    <ul class="navbar-links desktop-menu">
      <li v-for="item in menuItems" :key="item.section">
        <a :href="'#' + item.section" @click.prevent="onNavClick(item.section)" :class="{ active: activeSection === item.section }">
          {{ item.label }}
        </a>
      </li>
    </ul>

    <div class="mobile-menu-toggle" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="mobile-menu" :class="{ active: isMobileMenuOpen }">
      <ul class="mobile-menu-links">
        <li v-for="(item, index) in menuItems" :key="'mobile-' + item.section" :style="{ animationDelay: isMobileMenuOpen ? (0.1 * (index + 1)) + 's' : '0s' }">
          <a :href="'#' + item.section" @click.prevent="onNavClick(item.section)" :class="{ active: activeSection === item.section }">
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

const navbarRef = ref(null)
let cachedSections = {}
let navbarHeight = ref(80)

const handleScroll = () => {
  if (isClickScrolling) return; // Hentikan kalkulasi jika sedang scroll dari klik

  const currentScroll = window.scrollY
  
  const aboutSection = cachedSections['about'];
  if (aboutSection && currentScroll < aboutSection.offsetTop - navbarHeight.value) {
      activeSection.value = 'home';
      isScrolled.value = currentScroll > 0;
      lastScroll = currentScroll;
      return; 
  }

  let current = 'home'
  const scrollUpOffset = 300
  for (let i = menuItems.length - 1; i >= 0; i--) {
    const section = cachedSections[menuItems[i].section]
    if (section) {
      let sectionTop = section.offsetTop - navbarHeight.value
      if (currentScroll < lastScroll) {
        if (i > 0) { 
          sectionTop -= scrollUpOffset
        }
      }
      if (currentScroll >= sectionTop) {
        current = menuItems[i].section
        break
      }
    }
  }

  activeSection.value = current
  isScrolled.value = currentScroll > 0

  if (currentScroll > lastScroll && currentScroll > 100) {
    isHidden.value = true
    isMobileMenuOpen.value = false
  } else {
    isHidden.value = false
  }
  
  lastScroll = currentScroll
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// ===== PERBAIKAN DI SINI =====
const onNavClick = (sectionId) => {
  isClickScrolling = true;
  isMobileMenuOpen.value = false;
  
  // 1. Langsung set tab aktif tanpa menunggu scroll selesai
  activeSection.value = sectionId;

  const targetSection = cachedSections[sectionId]
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // 2. Beri jeda sebelum logika scroll otomatis aktif lagi
  setTimeout(() => {
    isClickScrolling = false
  }, 1000); // Diberi waktu 1 detik, cukup untuk scroll selesai
}

onMounted(() => {
  menuItems.forEach(item => {
    cachedSections[item.section] = document.getElementById(item.section)
  })
  if(navbarRef.value) {
    navbarHeight.value = navbarRef.value.offsetHeight
  }
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Kode CSS Anda sudah benar dan tidak perlu diubah */
.navbar {
  width: 100%;
  padding: 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(14, 14, 14, 0.4);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: fixed;
  top: 0;
  z-index: 1000;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}
.navbar.hidden { transform: translateY(-100%); }
.navbar.scrolled {
  background: rgba(14, 14, 14, 0.65);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}
.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.navbar-logo:hover { transform: scale(1.05); }
.navbar-links {
  list-style: none;
  display: flex;
  gap: 2.5rem;
}
.navbar-links a {
  text-decoration: none;
  font-size: 1rem;
  color: #f5f5f5;
  transition: all 0.3s ease;
}
.navbar-links a:hover {
  color: var(--neon-blue);
  text-shadow: 0 0 5px var(--neon-blue), 0 0 10px var(--neon-blue);
}
.navbar-links a.active {
  color: var(--pikachu-yellow);
  text-shadow: 0 0 5px var(--pikachu-yellow), 0 0 10px var(--pikachu-yellow);
}
.mobile-menu-toggle { display: none; }
.mobile-menu { display: none; }
@media (max-width: 1024px) and (min-width: 769px) {
  .navbar { padding: 1rem 2rem; }
  .navbar-links {
    flex-grow: 1;
    justify-content: flex-end;
  }
}
@media (max-width: 768px) {
  .navbar { padding: 1rem 1.5rem; }
  .navbar-links { display: none; }
  .navbar-logo { font-size: 1.3rem; }
  .mobile-menu-toggle {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    z-index: 1001;
  }
  .mobile-menu-toggle span {
    width: 25px;
    height: 3px;
    background: var(--pikachu-yellow);
    margin: 3px 0;
    transition: all 0.3s ease;
    border-radius: 2px;
  }
  .mobile-menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(7px, 7px); }
  .mobile-menu-toggle.active span:nth-child(2) { opacity: 0; }
  .mobile-menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(6px, -6px); }
  .mobile-menu {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(14, 14, 14, 0.98);
    backdrop-filter: blur(20px);
    align-items: center;
    justify-content: center;
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
  }
  .mobile-menu.active { transform: translateX(0); }
  .mobile-menu-links { list-style: none; text-align: center; padding: 0; margin: 0; }
  .mobile-menu-links li { margin: 2rem 0; opacity: 0; transform: translateY(20px); animation: fadeInUp 0.6s ease forwards; }
  .mobile-menu.active .mobile-menu-links li:nth-child(1) { animation-delay: 0.1s; }
  .mobile-menu.active .mobile-menu-links li:nth-child(2) { animation-delay: 0.2s; }
  .mobile-menu.active .mobile-menu-links li:nth-child(3) { animation-delay: 0.3s; }
  .mobile-menu.active .mobile-menu-links li:nth-child(4) { animation-delay: 0.4s; }
  .mobile-menu-links a {
    font-size: 2rem;
    font-weight: 700;
    text-decoration: none;
    color: var(--text-white);
    transition: all 0.3s ease;
    display: block;
    padding: 0.5rem 1rem;
  }
  .mobile-menu-links a:hover { color: var(--neon-blue); text-shadow: 0 0 15px var(--neon-blue); transform: scale(1.1); }
  .mobile-menu-links a.active { color: var(--pikachu-yellow); text-shadow: 0 0 15px var(--pikachu-yellow); transform: scale(1.1); }
}
@media (max-width: 480px) {
  .navbar { padding: 0.8rem 1rem; }
  .navbar-logo { font-size: 1.2rem; }
  .mobile-menu-links a { font-size: 1.8rem; }
}
</style>