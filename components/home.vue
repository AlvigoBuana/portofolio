<template>
  <section id="home" ref="homeSectionRef">
    <div class="content-wrapper">
      <div class="home-flex">

        <div class="left-content">
          <div class="innovation-badge anim-item anim-up">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Ready to Innovate</span>
          </div>

          <h1 class="main-title anim-item anim-left" style="transition-delay: 0.2s">
            <span class="title-frontend">Frontend</span>
            <span class="title-developer">Developer</span>
          </h1>

          <div class="typing-container anim-item anim-left" style="transition-delay: 0.4s">
            <span class="typing-text">
              {{ currentText }}
              <span class="cursor">|</span>
            </span>
          </div>

          <p class="description anim-item anim-up" style="transition-delay: 0.6s">
            Still learning and exploring the world of web development.
            I'm Alvigo Wahyu Buana, a tech and game enthusiast.
            I like creating innovative Web Development.
            Join me on this journey of discovery and growth.
          </p>

          <div class="tech-stack anim-item anim-up" style="transition-delay: 0.8s">
            <span v-for="tech in techStack" :key="tech" class="tech-tag">
              {{ tech }}
            </span>
          </div>

          <div class="action-buttons anim-item anim-up" style="transition-delay: 1.0s">
            <button class="btn-projects" @click="scrollToSection('#portofolio')">
              <span>Projects</span>
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
            <button class="btn-contact" @click="scrollToSection('#contact')">
              <span>Contact</span>
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </button>
          </div>

          <div class="social-links anim-item anim-up" style="transition-delay: 1.2s">
            <a v-for="social in socialMedia" :key="social.name" :href="social.href" class="social-link" target="_blank" rel="noopener noreferrer">
              <img :src="social.image" :alt="social.name" class="social-icon" />
            </a>
          </div>
        </div>

        <div class="right-content anim-item anim-right" style="transition-delay: 0.5s">
          <img src="/pikachu.gif" alt="Pikachu" class="pikachu-anim" />
        </div>
      </div>
    </div>

    <div class="electric-accent electric-accent-right"></div>
    <div class="electric-accent electric-accent-left"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const currentText = ref('')
const currentIndex = ref(0)
const isDeleting = ref(false)
const textIndex = ref(0)
const typingInterval = ref(null)

const texts = ['Alvigo Wahyu Buana', 'Tech & Game Enthusiast']
const techStack = ['C++', 'Javascript', 'Python', 'Tailwind']

const socialMedia = [
  { name: 'github', href: 'https://github.com/AlvigoBuana', image: '/github.svg' },
  { name: 'linkedin', href: 'https://www.linkedin.com/in/alvigo-wahyu-buana-83bb712b6/', image: '/linkedin.svg' },
  { name: 'instagram', href: 'https://instagram.com/alvgwb_', image: '/instagram.svg' }
]

// --- Typing Effect ---
const startTyping = () => {
  if (typingInterval.value) clearInterval(typingInterval.value)
  typingInterval.value = setInterval(() => {
    const currentFullText = texts[textIndex.value]
    if (!isDeleting.value) {
      if (currentIndex.value < currentFullText.length) {
        currentText.value = currentFullText.substring(0, currentIndex.value + 1)
        currentIndex.value++
      } else {
        setTimeout(() => { isDeleting.value = true }, 2000)
      }
    } else {
      if (currentIndex.value > 0) {
        currentText.value = currentFullText.substring(0, currentIndex.value - 1)
        currentIndex.value--
      } else {
        isDeleting.value = false
        textIndex.value = (textIndex.value + 1) % texts.length
      }
    }
  }, isDeleting.value ? 50 : 100)
}

const scrollToSection = (selector) => {
  const section = document.querySelector(selector)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

// --- Animation Logic (Replay on Scroll) ---
const homeSectionRef = ref(null)
let observer = null

onMounted(() => {
  startTyping()

  // Setup Observer
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Logic Replay: Masuk = Add Class, Keluar = Remove Class
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
      } else {
        entry.target.classList.remove('in-view')
      }
    })
  }, { threshold: 0.1 }) // 10% masuk layar langsung trigger

  if (homeSectionRef.value) {
    observer.observe(homeSectionRef.value)
  }
})

onBeforeUnmount(() => {
  if (typingInterval.value) clearInterval(typingInterval.value)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* ===== ANIMATION CLASSES (New) ===== */
/* State Awal: Hidden & Geser */
.anim-item {
  opacity: 0;
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.anim-up { transform: translateY(30px); }
.anim-left { transform: translateX(-50px); }
.anim-right { transform: translateX(50px); }

/* Trigger: State Akhir (Visible & Posisi Normal) */
#home.in-view .anim-item {
  opacity: 1;
  transform: translate(0, 0);
}


/* ===== BASE STYLES (Sama seperti sebelumnya) ===== */
#home {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  min-height: 100vh;
  padding-top: 80px;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  z-index: 10;
}

.home-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.left-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.right-content {
  flex: 0 0 400px;
  display: flex;
  justify-content: center;
}

/* Gambar Desktop */
.pikachu-anim {
  width: 100%;
  max-width: 400px;
  height: auto;
  animation: floatAnim 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
}

@keyframes floatAnim {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Badge */
.innovation-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(234, 191, 51, 0.3);
  background: rgba(255, 94, 0, 0.15);
  backdrop-filter: blur(4px);
  margin-bottom: 1.5rem;
  color: rgb(231, 192, 19);
  font-size: 0.875rem;
  font-weight: 500;
}
.innovation-badge .icon { width: 1rem; height: 1rem; }

/* Typography */
.main-title {
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.title-frontend { display: block; color: white; }
.title-developer {
  background: linear-gradient(135deg, rgb(253, 246, 181), rgb(253, 211, 147), rgb(234, 88, 51));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.typing-container {
  height: 3rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.typing-text { font-size: 2rem; font-weight: 500; color: var(--pikachu-yellow); }
.cursor { animation: blink 1s infinite; margin-left: 2px; }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

.description {
  color: #d1d5db;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 36rem;
}

/* Tech Stack */
.tech-stack {
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2.5rem; justify-content: flex-start;
}
.tech-tag {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid #4b5563;
  background: rgba(31, 51, 55, 0.5);
  color: #d1d9db;
  font-size: 0.875rem;
  transition: 0.3s;
}
.tech-tag:hover { border-color: var(--pikachu-yellow); color: var(--pikachu-yellow); }

/* Buttons */
.action-buttons {
  display: flex; gap: 1.5rem; margin-bottom: 2.5rem; justify-content: flex-start;
}
.btn-projects, .btn-contact {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600; cursor: pointer;
  transition: 0.3s;
}
.btn-projects {
  background: linear-gradient(135deg, #eba625, #d8681d);
  color: white; border: none;
  box-shadow: 0 4px 15px rgba(248, 121, 17, 0.4);
}
.btn-projects:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(248, 121, 17, 0.6); }

.btn-contact {
  background: transparent; border: 1px solid #4b5563; color: #d1d5db;
}
.btn-contact:hover { border-color: var(--pikachu-yellow); color: var(--pikachu-yellow); transform: translateY(-3px); }
.btn-icon { width: 1rem; height: 1rem; }

/* Socials */
.social-links {
  display: flex; gap: 1rem; justify-content: flex-start;
}
.social-link {
  width: 3rem; height: 3rem;
  border-radius: 0.5rem; border: 1px solid #4b5563;
  background: rgba(31, 41, 55, 0.5);
  display: flex; align-items: center; justify-content: center;
  transition: 0.3s;
}
.social-link:hover { border-color: var(--pikachu-yellow); transform: translateY(-3px); }
.social-icon { width: 1.5rem; height: 1.5rem; filter: brightness(0.8); transition: 0.3s; }
.social-link:hover .social-icon { filter: brightness(1); transform: scale(1.1); }

/* Accents */
.electric-accent {
  position: absolute;
  background: linear-gradient(180deg, transparent, var(--pikachu-yellow), transparent);
  opacity: 0.6; z-index: -1;
  animation: pulse 2s infinite;
}
.electric-accent-right { top: 50%; right: 4rem; width: 4px; height: 8rem; transform: translateY(-50%); }
.electric-accent-left { bottom: 8rem; left: 2rem; width: 2px; height: 4rem; opacity: 0.4; }
@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }


/* =========================================
   MEDIA QUERIES (Fixed: Pikachu Hilang di Tablet/HP)
   ========================================= */

/* 1. TABLET / IPAD (Max 1024px) */
@media (max-width: 1024px) {
  .right-content {
    display: none; /* Pikachu Hilang */
  }

  .home-flex {
    justify-content: flex-start;
    gap: 0;
  }

  .left-content {
    width: 100%;
    align-items: flex-start;
    text-align: left;
  }

  .main-title { font-size: 3.5rem; }
  .description { max-width: 80%; margin-left: 0; }

  .electric-accent-right { display: none; }
}

/* 2. MOBILE (Max 768px) */
@media (max-width: 768px) {
  #home {
    padding-top: 100px;
    min-height: auto;
    padding-bottom: 4rem;
  }

  .main-title { font-size: 2.8rem; }
  .typing-text { font-size: 1.5rem; }
  .description { max-width: 100%; }

  /* Buttons Stack */
  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    align-items: flex-start;
  }

  .btn-projects, .btn-contact {
    width: 100%;
    justify-content: center;
  }
}
</style>