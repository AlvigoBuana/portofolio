<template>
  <footer ref="footerRef" class="footer">
        <BackgroundVideo
      class="footer-video"
      src="/footerClip.mp4"
      poster="/footerClip-poster.webp"
    />
    <div class="footer-video-overlay" aria-hidden="true"></div>
    <div class="footer-divider"></div>

    <div class="footer-content">
      <div class="footer-brand">
        <h2 class="brand-logo" @click="scrollToTop">
          "See You On The Next Journey"
        </h2>
        <p class="brand-tagline">Code, Create, Innovate.</p>
      </div>

      <ul class="footer-nav">
        <li>
          <a href="#home" @click.prevent="scrollToSection('home')">Home</a>
        </li>
        <li>
          <a href="#about" @click.prevent="scrollToSection('about')">About</a>
        </li>
        <li>
          <a href="#portofolio" @click.prevent="scrollToSection('portofolio')"
            >Journey</a
          >
        </li>
        <li>
          <a href="#contact" @click.prevent="scrollToSection('contact')"
            >Contact</a
          >
        </li>
      </ul>

      <div class="footer-socials">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          class="social-icon-link"
        >
          <img :src="social.icon" :alt="social.name" />
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <p>
        &copy; {{ currentYear }}
        <span class="highlight">Alvigo Wahyu Buana</span>. All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { scrollToSection } from "~/utils/navigation.js";

const scrollToTop = () => scrollToSection("home");

// Ambil tahun otomatis biar ga usah ganti manual tiap tahun baru
const currentYear = new Date().getFullYear();

const socialLinks = ref([
  {
    name: "Github",
    href: "https://github.com/AlvigoBuana",
    icon: "/github.svg",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/alvigo-wahyu-buana-83bb712b6/",
    icon: "/linkedin.svg",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/alvgwb_",
    icon: "/instagram.svg",
  },
]);

const footerRef = ref(null);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      footerRef.value?.classList.toggle("in-view", entry.isIntersecting);
    },
    { threshold: 0.1 },
  );

  if (footerRef.value) observer.observe(footerRef.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.footer {
  position: relative;
  isolation: isolate;
  background-color: transparent;
  padding: 4rem clamp(1rem, 4vw, 2rem) 2rem;
  color: rgb(209, 213, 219);
  text-align: center;
  overflow: hidden;
}

.footer-video,
.footer-video-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.footer-video {
  object-fit: cover;
  object-position: center;
  opacity: 0.5;
}

.footer-video-overlay {
  background:
    linear-gradient(180deg, rgba(5, 5, 5, 0.56), rgba(5, 5, 5, 0.82)),
    linear-gradient(
      90deg,
      rgba(5, 5, 5, 0.42),
      transparent 50%,
      rgba(5, 5, 5, 0.42)
    );
}

.footer > :not(.footer-video):not(.footer-video-overlay) {
  position: relative;
  z-index: 1;
}

.footer-content,
.footer-bottom {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 700ms ease,
    transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.footer-bottom {
  transition-delay: 140ms;
}
.footer.in-view .footer-content,
.footer.in-view .footer-bottom {
  opacity: 1;
  transform: translateY(0);
}

/* Garis Neon Pemanis */
.footer-divider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--pikachu-yellow),
    transparent
  );
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
  font-family: "Rajdhani", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--pikachu-yellow);
  cursor: pointer;
  transition: color 0.3s ease;
  margin-bottom: 0.5rem;
}
.brand-logo:hover {
  color: var(--text-white);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.brand-tagline {
  font-size: 0.9rem;
  color: rgb(156, 163, 175);
}

.footer-journey-message {
  margin-bottom: 1.25rem;
  color: var(--text-white);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 5vw, 4.5rem);
  letter-spacing: -0.04em;
  line-height: 1;
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
  display: inline-flex;
  align-items: center;
  min-height: 44px;
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
  width: 44px;
  height: 44px;
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
  border-top: 1px solid rgba(207, 136, 30, 0.226);
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
  .footer {
    padding: 3rem clamp(1rem, 5vw, 2rem) 1.5rem;
  }

  .footer-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem 1.25rem;
  }

  .brand-logo {
    font-size: clamp(1.35rem, 6vw, 2rem);
  }

  .footer-socials {
    gap: 1rem;
  }

  .footer-bottom {
    font-size: 0.8rem;
  }
}

@media (max-width: 380px) {
  .footer-nav {
    gap: 0.5rem 0.9rem;
  }

  .footer-nav a {
    font-size: 0.9rem;
  }
}
</style>
