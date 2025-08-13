<template>
  <section id="home">
    <!-- Background elements - will be handled by your existing CSS -->
    <div class="scan-line"></div>
    <div class="bg-layer"></div>
    <div class="geometric-bg"></div>
    
    <div class="content-wrapper">
      <!-- Ready to Innovate Badge -->
      <div class="innovation-badge">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Ready to Innovate</span>
      </div>
      
      <!-- Main Title -->
      <h1 class="main-title">
        <span class="title-frontend">Frontend</span>
        <span class="title-developer">Developer</span>
      </h1>
      
      <!-- Typing Effect -->
      <div class="typing-container">
        <span class="typing-text">
          {{ currentText }}
          <span class="cursor">|</span>
        </span>
      </div>
      
      <!-- Description -->
      <p class="description">
        Menciptakan Website Yang Inovatif, 
        Fungsional, dan User-Friendly untuk Solusi 
        Digital.
      </p>
      
      <!-- Tech Stack Tags -->
      <div class="tech-stack">
        <span 
          v-for="tech in techStack" 
          :key="tech"
          class="tech-tag"
        >
          {{ tech }}
        </span>
      </div>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-projects" @click="goToProjects">
          <span>Projects</span>
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
        
        <button class="btn-contact" @click="goToContact">
          <span>Contact</span>
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      
      <!-- Social Links -->
      <div class="social-links">
        <a
          v-for="social in socialMedia"
          :key="social.name"
          :href="social.href"
          class="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            :src="social.image" 
            :alt="social.name"
            class="social-icon"
          />
        </a>
      </div>
    </div>
    
    <!-- Decorative Electric Elements -->
    <div class="electric-accent electric-accent-right"></div>
    <div class="electric-accent electric-accent-left"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive data
const currentText = ref('')
const currentIndex = ref(0)
const isDeleting = ref(false)
const textIndex = ref(0)
const typingInterval = ref(null)

// Static data
const texts = ['Alvigo Wahyu Buana', 'Tech & Game Enthusiast']
const techStack = ['React', 'Javascript', 'Node.js', 'Tailwind']

// Social media data with local images
const socialMedia = [
  {
    name: 'github',
    href: 'https://github.com/AlvigoBuana',
    image: '/github.svg'
  },
  {
    name: 'linkedin',
    href: 'https://www.linkedin.com/in/alvigo-wahyu-buana-83bb712b6/',
    image: '/linkedin.svg'
  },
  {
    name: 'instagram',
    href: 'https://instagram.com/alvgwb_',
    image: '/instagram.svg'
  }
]

// Methods
const startTyping = () => {
  typingInterval.value = setInterval(() => {
    const currentFullText = texts[textIndex.value]
    
    if (!isDeleting.value) {
      // Typing
      if (currentIndex.value < currentFullText.length) {
        currentText.value = currentFullText.substring(0, currentIndex.value + 1)
        currentIndex.value++
      } else {
        // Wait before deleting
        setTimeout(() => {
          isDeleting.value = true
        }, 2000)
      }
    } else {
      // Deleting
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

const goToProjects = () => {
  // Navigate to projects section or route
  const projectsSection = document.querySelector('#projects')
  if (projectsSection) {
    projectsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToContact = () => {
  // Navigate to contact section or route
  const contactSection = document.querySelector('#contact')
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// Lifecycle
onMounted(() => {
  startTyping()
})

onUnmounted(() => {
  if (typingInterval.value) {
    clearInterval(typingInterval.value)
  }
})
</script>

<style scoped>
.home-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6rem 3rem;
  position: relative;
}

.content-wrapper {
  max-width: 32rem;
  z-index: 10;
}

/* Innovation Badge */
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
  color: rgb(231, 192, 19);
  font-size: 0.875rem;
  font-weight: 500;
}

.innovation-badge .icon {
  width: 1rem;
  height: 1rem;
  color: rgb(231, 192, 19);
}

/* Main Title */
.main-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.title-frontend {
  display: block;
  color: white;
  margin-bottom: 0.5rem;
}

.title-developer {
  background: linear-gradient(135deg, rgb(253, 246, 181), rgb(253, 211, 147), rgb(234, 88, 51));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Typing Effect */
.typing-container {
  height: 3rem;
  margin-bottom: 2rem;
}

.typing-text {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--pikachu-yellow);
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Description */
.description {
  color: rgb(209, 213, 219);
  font-size: 1.125rem;
  line-height: 1.625;
  margin-bottom: 2rem;
  max-width: 28rem;
}

/* Tech Stack */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

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

.tech-tag:hover {
  border-color: rgba(255, 215, 0, 0.5);
  color: var(--pikachu-yellow);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-projects {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgb(235, 166, 37), rgb(216, 104, 29));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: scale(1);
}

.btn-projects:hover {
  background: linear-gradient(135deg, var(--neon-blue), rgb(0, 173, 253));
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
  color: rgb(0, 0, 0);
}

.btn-projects .btn-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

.btn-projects:hover .btn-icon {
  transform: translateX(4px);
}

.btn-contact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid rgb(75, 85, 99);
  background: transparent;
  color: rgb(209, 213, 219);
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: scale(1);
}

.btn-contact:hover {
  border-color: var(--pikachu-yellow);
  color: var(--pikachu-yellow);
  transform: scale(1.05);
}

.btn-contact .btn-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

.btn-contact:hover .btn-icon {
  transform: rotate(12deg);
}

/* Social Links */
.social-links {
  display: flex;
  gap: 1rem;
}

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
  color: rgb(156, 163, 175);
  text-decoration: none;
  transition: all 0.3s ease;
  transform: scale(1);
}

.social-link:hover {
  border-color: var(--pikachu-yellow);
  color: var(--pikachu-yellow);
  transform: scale(1.1);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
  filter: brightness(0.8);
}

.social-link:hover .social-icon {
  transform: rotate(12deg) scale(1.1);
  filter: brightness(1.2);
  color: var(--pikachu-yellow);
}

/* Electric Accents */
.electric-accent {
  position: absolute;
  background: linear-gradient(180deg, transparent 0%, var(--pikachu-yellow) 50%, transparent 100%);
  opacity: 0.6;
  animation: pulse 2s ease-in-out infinite;
}

.electric-accent-right {
  top: 50%;
  right: 4rem;
  width: 4px;
  height: 8rem;
  transform: translateY(-50%);
}

.electric-accent-left {
  bottom: 8rem;
  left: 2rem;
  width: 2px;
  height: 4rem;
  opacity: 0.4;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

/* Responsive */
@media (max-width: 768px) {
  .home-section {
    padding: 4rem 1.5rem;
  }
  
  .main-title {
    font-size: 3rem;
  }
  
  .typing-text {
    font-size: 1.25rem;
  }
  
  .description {
    font-size: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .tech-stack {
    gap: 0.5rem;
  }
  
  .electric-accent-right {
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .typing-text {
    font-size: 1.125rem;
  }
}
</style>