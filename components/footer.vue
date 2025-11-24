<template>
  <footer class="footer">
    <div class="footer-divider"></div>

    <div class="footer-content">

      <div class="footer-brand">
        <h2 class="brand-logo" @click="scrollToTop">alvigowb</h2>
        <p class="brand-tagline">Code, Create, Innovate.</p>
      </div>

      <ul class="footer-nav">
        <li><a href="#home" @click.prevent="scrollToSection('home')">Home</a></li>
        <li><a href="#about" @click.prevent="scrollToSection('about')">About</a></li>
        <li><a href="#portofolio" @click.prevent="scrollToSection('portofolio')">Portfolio</a></li>
        <li><a href="#contact" @click.prevent="scrollToSection('contact')">Contact</a></li>
      </ul>

      <div class="footer-socials">
        <a v-for="social in socialLinks" :key="social.name" :href="social.href" target="_blank" rel="noopener noreferrer" class="social-icon-link">
          <img :src="social.icon" :alt="social.name">
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <p>
        &copy; {{ currentYear }} <span class="highlight">Alvigo Wahyu Buana</span>. All Rights Reserved.
      </p>
      <p class="credits">Built with Vue.js & Nuxt</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

// Ambil tahun otomatis biar ga usah ganti manual tiap tahun baru
const currentYear = new Date().getFullYear();

const socialLinks = ref([
  { name: 'Github', href: 'https://github.com/AlvigoBuana', icon: '/github.svg' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/alvigo-wahyu-buana-83bb712b6/', icon: '/linkedin.svg' },
  { name: 'Instagram', href: 'https://instagram.com/alvgwb_', icon: '/instagram.svg' }
]);

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.footer {
  position: relative;
  background-color: #050505; /* Lebih gelap dari bg utama */
  padding: 4rem 2rem 2rem;
  color: rgb(209, 213, 219);
  text-align: center;
  overflow: hidden;
}

/* Garis Neon Pemanis */
.footer-divider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--pikachu-yellow), transparent);
  opacity: 0.5;
  box-shadow: 0 0 10px var(--pikachu-yellow);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

/* Brand */
.brand-logo {
  font-family: 'Rajdhani', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-white);
  cursor: pointer;
  transition: color 0.3s ease;
  margin-bottom: 0.5rem;
}
.brand-logo:hover {
  color: var(--pikachu-yellow);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.brand-tagline {
  font-size: 0.9rem;
  color: rgb(156, 163, 175);
}

/* Navigasi */
.footer-nav {
  display: flex;
  gap: 2rem;
  list-style: none;
  padding: 0;
}
.footer-nav a {
  text-decoration: none;
  color: rgb(209, 213, 219);
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1rem;
}
.footer-nav a:hover {
  color: var(--pikachu-yellow);
  transform: translateY(-2px);
}

/* Socials */
.footer-socials {
  display: flex;
  gap: 1.5rem;
}
.social-icon-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}
.social-icon-link img {
  width: 20px;
  height: 20px;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}
.social-icon-link:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: var(--pikachu-yellow);
  transform: translateY(-3px);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}
.social-icon-link:hover img {
  filter: grayscale(0%);
}

/* Bottom Copyright */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 2rem;
  font-size: 0.9rem;
  color: rgb(107, 114, 128);
}
.highlight {
  color: var(--pikachu-yellow);
  font-weight: 600;
}
.credits {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  opacity: 0.6;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-nav {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>