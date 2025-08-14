<template>
  <section id="home">
    <div class="content-wrapper">
      <div class="home-flex">
        <div class="left-content">
          <div class="innovation-badge g-fade-in-up" style="animation-delay: 0.1s">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Ready to Innovate</span>
          </div>
          <h1 class="main-title g-fade-in-left" style="animation-delay: 0.3s">
            <span class="title-frontend">Frontend</span>
            <span class="title-developer">Developer</span>
          </h1>
          <div class="typing-container g-fade-in-left" style="animation-delay: 0.5s">
            <span class="typing-text">
              {{ currentText }}
              <span class="cursor">|</span>
            </span>
          </div>
          <p class="description g-fade-in-up" style="animation-delay: 0.7s">
            Still learning and exploring the world of web development.
            I'm Alvigo Wahyu Buana, a tech and game enthusiast.
            I like to creating innovative Web Development. 
            Join me on this journey of discovery and growth
          </p>
          <div class="tech-stack g-fade-in-up" style="animation-delay: 0.9s">
            <span v-for="tech in techStack" :key="tech" class="tech-tag">
              {{ tech }}
            </span>
          </div>
          <div class="action-buttons g-fade-in-up" style="animation-delay: 1.1s">
            <button class="btn-projects" @click="scrollToSection('#portofolio')">
              <span>Projects</span>
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
            <button class="btn-contact" @click="scrollToSection('#contact')">
              <span>Contact</span>
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </button>
          </div>
          <div class="social-links g-fade-in-up" style="animation-delay: 1.3s">
            <a v-for="social in socialMedia" :key="social.name" :href="social.href" class="social-link" target="_blank" rel="noopener noreferrer">
              <img :src="social.image" :alt="social.name" class="social-icon" />
            </a>
          </div>
        </div>
        <div class="right-content g-fade-in-right" style="animation-delay: 0.5s">
          <img src="/public/pikachu.gif" alt="Pikachu" class="pikachu-anim" />
        </div>
      </div>
    </div>
    <div class="electric-accent electric-accent-right"></div>
    <div class="electric-accent electric-accent-left"></div>
  </section>
</template>

<script setup>
// Bagian script tidak ada perubahan
import { ref, onMounted, onUnmounted } from 'vue'
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
const startTyping = () => {
  typingInterval.value = setInterval(() => {
    const currentFullText = texts[textIndex.value];
    if (!isDeleting.value) {
      if (currentIndex.value < currentFullText.length) {
        currentText.value = currentFullText.substring(0, currentIndex.value + 1);
        currentIndex.value++;
      } else {
        setTimeout(() => { isDeleting.value = true; }, 2000);
      }
    } else {
      if (currentIndex.value > 0) {
        currentText.value = currentFullText.substring(0, currentIndex.value - 1);
        currentIndex.value--;
      } else {
        isDeleting.value = false;
        textIndex.value = (textIndex.value + 1) % texts.length;
      }
    }
  }, isDeleting.value ? 50 : 100);
};
const scrollToSection = (selector) => {
  const section = document.querySelector(selector);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};
onMounted(() => startTyping());
onUnmounted(() => {
  if (typingInterval.value) clearInterval(typingInterval.value);
});
</script>

<style scoped>
/* BLOK CSS UNTUK #home YANG SEBELUMNYA SAYA TAMBAHKAN TELAH DIHAPUS.
  Sekarang <section id="home"> akan mengikuti style global untuk <section>
  sehingga layout kembali seperti semula.
*/
.content-wrapper {
  max-width: 1600px;
  margin: auto;
  padding: 0 2rem;
}
.home-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}
.left-content { flex: 1 1 70%; }
.right-content {
  flex: 1 1 30%;
  display: flex;
  justify-content: center;
}
.pikachu-anim {
  width: 480px;
  max-width: 100%;
  animation: floatAnim 3s ease-in-out infinite;
}
@keyframes floatAnim {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.innovation-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(234, 191, 51, 0.3);
  background: rgba(255, 94, 0, 0.384);
  backdrop-filter: blur(4px);
  margin-bottom: 2rem;
  margin-top: 3rem;
  color: rgb(231, 192, 19);
  font-size: 0.875rem;
  font-weight: 500;
}
.innovation-badge .icon { width: 1rem; height: 1rem; color: rgb(231, 192, 19); }
.main-title {
  font-size: 5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.1;
}
.title-frontend { display: block; color: rgb(255, 255, 255); margin-bottom: 0.5rem; }
.title-developer {
  background: linear-gradient(135deg, rgb(253, 246, 181), rgb(253, 211, 147), rgb(234, 88, 51));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.typing-container { height: 3rem; margin-bottom: 2rem; }
.typing-text { font-size: 2rem; font-weight: 500; color: var(--pikachu-yellow); }
.cursor { animation: blink 1s infinite; }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
.description {
  color: rgb(209, 213, 219);
  font-size: 1.125rem;
  line-height: 1.625;
  margin-bottom: 2rem;
  max-width: 30rem;
}
.tech-stack { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem; }
.tech-tag {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgb(75, 85, 99);
  background: rgba(31, 51, 55, 0.5);
  backdrop-filter: blur(4px);
  color: rgb(209, 217, 219);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: default;
  transition: all 0.3s ease;
}
.tech-tag:hover { border-color: rgba(255, 215, 0, 0.5); color: var(--pikachu-yellow); }
.action-buttons { display: flex; gap: 2rem; margin-bottom: 2rem; }
.btn-projects, .btn-contact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: scale(1);
}
.btn-projects {
  background: linear-gradient(135deg, rgb(235, 166, 37), rgb(216, 104, 29));
  color: white;
  border: none;
  box-shadow: 0 2px 15px rgba(248, 121, 17, 0.671);
}
.btn-projects:hover {
  background: linear-gradient(135deg, var(--neon-blue), rgb(0, 173, 253));
  transform: scale(1.05);
  gap: 1rem;
  box-shadow: 0 2px 15px rgba(37, 100, 235, 0.692);
  color: #000;
}
.btn-contact {
  border: 1px solid rgb(75, 85, 99);
  background: transparent;
  color: rgb(209, 213, 219);
  box-shadow: 0 2px 15px rgba(94, 92, 92, 0.671);
}
.btn-contact:hover {
  border-color: var(--pikachu-yellow);
  color: var(--pikachu-yellow);
  transform: scale(1.05);
  box-shadow: 0 2px 15px rgba(255, 215, 0, 0.671);
  gap: 1rem;
}
.btn-icon { width: 1rem; height: 1rem; transition: transform 0.3s ease; }
.btn-projects:hover .btn-icon { transform: translateX(4px); }
.btn-contact:hover .btn-icon { transform: rotate(12deg); }
.social-links { display: flex; gap: 1rem; }
.social-link {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(75, 85, 99);
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: scale(1);
  box-shadow: 0 2px 15px rgba(94, 92, 92, 0.671);
}
.social-link:hover {
  border-color: var(--pikachu-yellow);
  transform: scale(1.1);
  box-shadow: 0 2px 15px rgba(255, 215, 0, 0.671);
}
.social-icon {
  width: 1.8rem;
  height: 1.8rem;
  transition: transform 0.3s ease-in-out;
  filter: brightness(0.8);
}
.social-link:hover .social-icon {
  transform: rotate(12deg) scale(1.1);
  filter: brightness(1.2);
}
.electric-accent {
  position: absolute;
  background: linear-gradient(180deg, transparent 0%, var(--pikachu-yellow) 50%, transparent 100%);
  opacity: 0.6;
  animation: pulse 2s ease-in-out infinite;
}
.electric-accent-right { top: 50%; right: 4rem; width: 4px; height: 8rem; transform: translateY(-50%); }
.electric-accent-left { bottom: 8rem; left: 2rem; width: 2px; height: 4rem; opacity: 0.4; }
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
@media (max-width: 768px) {
  .home-flex { flex-direction: column; }
  .left-content, .right-content { flex: unset; width: 100%; }
  .main-title { font-size: 3rem; }
  .typing-text { font-size: 1.25rem; }
  .description { font-size: 1rem; }
  .action-buttons { flex-direction: column; }
  .tech-stack { gap: 0.5rem; }
  .electric-accent-right { right: 1rem; }
  .pikachu-anim { width: 200px; }
}
@media (max-width: 480px) {
  .main-title { font-size: 2.5rem; }
  .typing-text { font-size: 1.125rem; }
}
</style>