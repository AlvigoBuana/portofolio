<template>
  <section id="portofolio" ref="portfolioSectionRef">
    <div class="content-wrapper">

      <div class="title-block">
        <h2 class="section-title">Portfolio Showcase</h2>
        <p class="subtitle">The Journey is not end here, Still Learning and Growing to raise the World. </p>
      </div>

      <div class="portfolio-nav">
        <button @click="setActiveTab('projects')" :class="{ active: activeTab === 'projects' }">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          <span>Projects</span>
        </button>
        <button @click="setActiveTab('certificates')" :class="{ active: activeTab === 'certificates' }">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
          <span>Certificates</span>
        </button>
        <button @click="setActiveTab('tech-stack')" :class="{ active: activeTab === 'tech-stack' }">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
          <span>Tech Stack</span>
        </button>
      </div>

      <div class="portfolio-content">
        <Transition name="fade" mode="out-in">
          <div v-if="activeTab === 'projects'" class="projects-container">
            <div class="grid project-grid">
              <div v-for="project in displayedProjects" :key="project.title" class="project-card">
                <div class="project-image-wrapper"><img :src="project.imageUrl" :alt="project.title" class="project-image"></div>
                <div class="project-info">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <p class="project-desc">{{ project.description }}</p>
                  <div class="project-links">
                    <a :href="project.liveUrl" target="_blank" class="btn-link"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>Live Demo</a>
                    <a :href="project.repoUrl" target="_blank" class="btn-link"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>Details</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="see-more-wrapper">
              <button v-if="projectsToShow < projects.length" @click="showMoreProjects" class="btn-see-more">See More</button>
              <button v-if="isShowingAll" @click="showLessProjects" class="btn-see-more">See Less</button>
            </div>
          </div>
          <div v-else-if="activeTab === 'certificates'" class="grid certificate-grid">
            <div v-for="cert in certificates" :key="cert.title" class="certificate-card">
              <img :src="cert.imageUrl" :alt="cert.title" class="cert-image">
              <div class="cert-overlay">
                <h3 class="cert-title">{{ cert.title }}</h3>
                <p class="cert-issuer">{{ cert.issuer }}</p>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab === 'tech-stack'" class="grid tech-stack-container">
            <div v-for="tech in techStack" :key="tech.name" class="tech-item">
              <img :src="tech.iconUrl" :alt="tech.name" class="tech-icon">
              <h3 class="tech-name">{{ tech.name }}</h3>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const activeTab = ref('projects');
const setActiveTab = (tabName) => {
  activeTab.value = tabName;
  if (window.location.hash) {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
};

const projects = ref([...Array(8)].map((_, i) => ({ title: `Project ${i + 1}`, description: 'A brief description of the project.', imageUrl: `/projects/project${i + 1}.png`, liveUrl: '#', repoUrl: '#', })));
const initialDesktopCount = 4;
const initialTabletCount = 6;
const initialMobileCount = 4;
const projectsToShow = ref(initialMobileCount);
const initialCount = ref(initialMobileCount);
const displayedProjects = computed(() => projects.value.slice(0, projectsToShow.value));
const showMoreProjects = () => { projectsToShow.value = projects.value.length; };
const showLessProjects = () => { updateInitialCount(true); };
const updateInitialCount = (forceReset = false) => {
  const screenWidth = window.innerWidth;
  let newInitialCount = initialMobileCount;
  if (screenWidth >= 1400) { newInitialCount = initialDesktopCount; } 
  else if (screenWidth >= 768) { newInitialCount = initialTabletCount; }
  initialCount.value = newInitialCount;
  if (forceReset || !isShowingAll.value) {
    projectsToShow.value = newInitialCount;
  }
};
const isShowingAll = computed(() => projectsToShow.value === projects.value.length);

const certificates = ref([
  { title: 'Front-End Web Development', issuer: 'Dicoding', imageUrl: '/certs/cert1.jpg' },
  { title: 'JavaScript Algorithms', issuer: 'freeCodeCamp', imageUrl: '/certs/cert2.jpg' },
  { title: 'Responsive Web Design', issuer: 'Coursera', imageUrl: '/certs/cert3.jpg' },
  { title: 'C# Fundamentals', issuer: 'Microsoft', imageUrl: '/certs/cert4.jpg' },
]);
const techStack = ref([
  { name: 'HTML5', iconUrl: 'https://cdn.svgporn.com/logos/html-5.svg' },
  { name: 'CSS3', iconUrl: 'https://cdn.svgporn.com/logos/css-3.svg' },
  { name: 'JavaScript', iconUrl: 'https://cdn.svgporn.com/logos/javascript.svg' },
  { name: 'Vue.js', iconUrl: 'https://cdn.svgporn.com/logos/vue.svg' },
  { name: 'Next.js', iconUrl: 'https://cdn.svgporn.com/logos/nextjs-icon.svg' },
  { name: 'C++', iconUrl: 'https://cdn.svgporn.com/logos/c-plusplus.svg' },
  { name: 'C#', iconUrl: 'https://cdn.svgporn.com/logos/c-sharp.svg' },
  { name: 'Bootstrap', iconUrl: 'https://cdn.svgporn.com/logos/bootstrap.svg' },
]);

const portfolioSectionRef = ref(null);
let observer;
let lastScrollY = window.scrollY;
let scrollDirection = 'down';

const checkUrlHashAndSetTab = () => {
  const hash = window.location.hash;
  if (hash.includes('?tab=')) {
    const targetTab = hash.split('?tab=')[1];
    if (['projects', 'certificates', 'tech-stack'].includes(targetTab)) {
      activeTab.value = targetTab;
    }
  }
};

const handleWindowScroll = () => { if (window.scrollY > lastScrollY) { scrollDirection = 'down'; } else { scrollDirection = 'up'; } lastScrollY = window.scrollY; };
const handleIntersection = (entries) => { const entry = entries[0]; if (entry.isIntersecting) { entry.target.classList.add('in-view'); } else { if (scrollDirection === 'up') { entry.target.classList.remove('in-view'); } } };

onMounted(() => {
  checkUrlHashAndSetTab();
  window.addEventListener('hashchange', checkUrlHashAndSetTab);
  
  window.addEventListener('scroll', handleWindowScroll);
  observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
  if (portfolioSectionRef.value) { observer.observe(portfolioSectionRef.value); }
  updateInitialCount();
  window.addEventListener('resize', updateInitialCount);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', checkUrlHashAndSetTab);
  window.removeEventListener('scroll', handleWindowScroll);
  if (observer) { observer.disconnect(); }
  window.removeEventListener('resize', updateInitialCount);
});
</script>

<style scoped>
/* ==== WRAPPER & BACKGROUND ==== */
#portofolio {
  position: relative;
  /* Dihapus: background-color dan border-top agar menyatu */
  overflow: hidden;
  padding-top: 50px;
}

/* DIHAPUS: Blok .aurora-bg, .aurora-dot, dan @keyframes aurora-drift */

/* ==== CONTENT WRAPPER ==== */
.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
  padding: 4rem 2rem 6rem;
}

/* ==== TITLES ==== */
.title-block {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--pikachu-yellow);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: rgb(209, 213, 219);
}

/* ==== TABS NAV ==== */
.portfolio-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 0 auto 3rem;
  max-width: 900px;
}

.portfolio-nav button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgb(209, 213, 219);
  transition: all 0.3s ease;
}

.portfolio-nav button svg {
  width: 1.2rem;
  height: 1.2rem;
}

.portfolio-nav button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-white);
}

.portfolio-nav button.active {
  background: var(--pikachu-yellow);
  color: var(--bg-dark);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  border-color: var(--pikachu-yellow);
}

/* ==== CONTENT AREA ==== */
.portfolio-content {
  min-height: 500px;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

/* ==== PROJECTS GRID ==== */
.project-grid {
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1400px) {
  .project-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Base card styles */
.project-card,
.certificate-card,
.tech-item {
  background: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
}

.project-card,
.certificate-card,
.tech-item {
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover,
.certificate-card:hover,
.tech-item:hover {
  transform: translateY(-5px);
  border-color: var(--pikachu-yellow);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

/* Project card detail */
.project-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.project-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}
.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.project-card:hover .project-image {
  transform: scale(1.05);
}
.project-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.project-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.project-desc {
  color: rgb(209, 213, 219);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex-grow: 1;
}
.project-links {
  display: flex;
  gap: 1.5rem;
  margin-top: auto;
}
.btn-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-white);
  text-decoration: none;
  transition: color 0.3s ease;
}
.btn-link:hover {
  color: var(--pikachu-yellow);
}
.btn-link svg {
  width: 1rem;
  height: 1rem;
}

/* See more */
.see-more-wrapper {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
}
.btn-see-more {
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: var(--pikachu-yellow);
  border: 2px solid var(--pikachu-yellow);
  transition: all 0.3s ease;
}
.btn-see-more:hover {
  background: var(--pikachu-yellow);
  color: var(--bg-dark);
}

/* ==== CERTIFICATES GRID ==== */
.certificate-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.certificate-card {
  position: relative;
  overflow: hidden;
}
.cert-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cert-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.certificate-card:hover .cert-overlay {
  opacity: 1;
}
.cert-title {
  font-size: 1.2rem;
  margin: 0;
}
.cert-issuer {
  font-size: 0.9rem;
  color: rgb(209, 213, 219);
}

/* ==== TECH STACK GRID ==== */
.tech-stack-container {
  display: grid;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 2rem auto;
  grid-template-columns: repeat(3, 1fr); /* Diubah untuk mobile */
}
@media (min-width: 768px) {
  .tech-stack-container {
    grid-template-columns: repeat(6, 1fr);
  }
}
@media (min-width: 1280px) {
  .tech-stack-container {
    grid-template-columns: repeat(8, 1fr);
  }
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 0.5rem;
  min-height: 120px;
}
.tech-item:hover {
  background: rgba(255, 215, 0, 0.1);
}
.tech-icon {
  width: 48px;
  height: 48px;
}
.tech-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-white);
}

/* ==== ANIMATIONS (scroll-in & tab fade) ==== */
.title-block,
.portfolio-nav,
.portfolio-content {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
#portofolio.in-view .title-block {
  opacity: 1;
  transform: translateY(0);
}
#portofolio.in-view .portfolio-nav {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.2s;
}
#portofolio.in-view .portfolio-content {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.4s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .project-card,
.fade-enter-from .certificate-card,
.fade-enter-from .tech-item {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-active .project-card,
.fade-enter-active .certificate-card,
.fade-enter-active .tech-item {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.fade-enter-active .project-card:nth-child(1),
.fade-enter-active .certificate-card:nth-child(1),
.fade-enter-active .tech-item:nth-child(1) {
  transition-delay: 0.05s;
}
.fade-enter-active .project-card:nth-child(2),
.fade-enter-active .certificate-card:nth-child(2),
.fade-enter-active .tech-item:nth-child(2) {
  transition-delay: 0.1s;
}
.fade-enter-active .project-card:nth-child(3),
.fade-enter-active .certificate-card:nth-child(3),
.fade-enter-active .tech-item:nth-child(3) {
  transition-delay: 0.15s;
}
.fade-enter-active .project-card:nth-child(4),
.fade-enter-active .certificate-card:nth-child(4),
.fade-enter-active .tech-item:nth-child(4) {
  transition-delay: 0.2s;
}
.fade-enter-active .project-card:nth-child(5) {
  transition-delay: 0.25s;
}
.fade-enter-active .project-card:nth-child(6) {
  transition-delay: 0.3s;
}
.fade-enter-active .tech-item:nth-child(5) {
  transition-delay: 0.25s;
}
.fade-enter-active .tech-item:nth-child(6) {
  transition-delay: 0.3s;
}
.fade-enter-active .tech-item:nth-child(7) {
  transition-delay: 0.35s;
}
.fade-enter-active .tech-item:nth-child(8) {
  transition-delay: 0.4s;
}

/* ==== RESPONSIVE ==== */
@media (max-width: 768px) {
  .portfolio-nav {
    grid-template-columns: 1fr;
  }
  .section-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 640px) {
  /* Diubah: Penyesuaian untuk layar mobile */
  .tech-stack-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>