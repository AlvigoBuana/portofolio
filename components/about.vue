<template>
  <section id="about" ref="aboutSectionRef">
    <div class="content-wrapper">
      
      <div class="title-block">
        <h2 class="section-title animated-item">About Me</h2>
        <p class="subtitle animated-item">⚡️ Nothing last forever, we can change the future ⚡️</p>
      </div>

      <div class="intro-flex">
        <div class="intro-text">
          <h1 class="animated-item from-left">Hello, I'm<br><span class="highlight-name">Alvigo Wahyu Buana</span></h1>
          <p class="bio animated-item from-left">
            A passionate web developer with a knack for creating innovative solutions. I specialize in crafting responsive and user-friendly websites that not only look great but also perform seamlessly across all devices.
            With a strong foundation in HTML, CSS, and JavaScript, I bring ideas to life through clean and efficient code. My goal is to leverage technology to solve real-world problems and enhance user experiences.
          </p>
          <div class="quote animated-item from-left">
            <p>"If you're not a goodshoot today. Don't worry, there are other ways to be useful"</p>
          </div>
          <div class="action-buttons animated-item">
            <a href="https://docs.google.com/document/d/1WK3gCM0rMtvzw2dw22KOVe1nULW5ojsFqohXWfrb_X4/edit?usp=sharing" download class="btn btn-primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Download CV</span>
            </a>
            <a href="#portofolio" class="btn btn-secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              <span>View Projects</span>
            </a>
          </div>
        </div>
        <div class="intro-photo animated-item from-right">
          <img src="/profile.png" alt="Alvigo Wahyu Buana">
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-item animated-item" @click="scrollToPortfolio('projects')">
          <div class="stat-icon-wrapper"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></div>
          <span class="stat-number">10+</span>
          <p class="stat-title">TOTAL PROJECTS</p>
          <p class="stat-desc">Innovative web solutions</p>
          <div class="stat-arrow">➔</div>
        </div>
        <div class="stat-item animated-item" @click="scrollToPortfolio('certificates')">
          <div class="stat-icon-wrapper"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg></div>
          <span class="stat-number">5+</span>
          <p class="stat-title">CERTIFICATES</p>
          <p class="stat-desc">Professional skills validated</p>
          <div class="stat-arrow">➔</div>
        </div>
        <div class="stat-item animated-item" @click="scrollToPortfolio('tech-stack')">
          <div class="stat-icon-wrapper"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9a9 9 0 019-9"></path></svg></div>
          <span class="stat-number">1+</span>
          <p class="stat-title">YEARS OF EXPERIENCE</p>
          <p class="stat-desc">Continuous learning journey</p>
          <div class="stat-arrow">➔</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const aboutSectionRef = ref(null);
let observer;
let lastScrollY = window.scrollY;
let scrollDirection = 'down';
const scrollToPortfolio = (targetTab = 'projects') => {
  window.location.hash = `portofolio?tab=${targetTab}`;
  const portfolioSection = document.querySelector('#portofolio');
  if (portfolioSection) {
    portfolioSection.scrollIntoView({ behavior: 'smooth' });
  }
};
const handleWindowScroll = () => {
  scrollDirection = window.scrollY > lastScrollY ? 'down' : 'up';
  lastScrollY = window.scrollY;
};
const handleIntersection = (entries) => {
  const entry = entries[0];
  if (entry.isIntersecting) {
    entry.target.classList.add('in-view');
  } else if (scrollDirection === 'up') {
    entry.target.classList.remove('in-view');
  }
};
onMounted(() => {
  window.addEventListener('scroll', handleWindowScroll);
  observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
  if (aboutSectionRef.value) {
    observer.observe(aboutSectionRef.value);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleWindowScroll);
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* ===== STRUKTUR UTAMA ===== */
.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.title-block {
  text-align: center;
  margin-bottom: 4rem;
}

.intro-flex {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 4rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* ===== KONTEN & TIPOGRAFI ===== */
.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-white);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--pikachu-yellow);
  font-weight: 500;
}

.intro-text {
  flex: 1;
}

.intro-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.highlight-name {
  color: var(--pikachu-yellow);
}

.bio {
  color: rgb(209, 213, 219);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.quote {
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid var(--pikachu-yellow);
  padding: 1rem;
  margin-bottom: 2rem;
  font-style: italic;
  color: rgb(209, 213, 219);
}

/* ===== FOTO PROFIL ===== */
.intro-photo {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 350px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}

.intro-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid var(--bg-dark);
  box-shadow: 0 0 25px var(--pikachu-yellow);
  transition: transform 0.4s ease-out;
}

.intro-photo:hover img {
  transform: scale(1.1);
}

.intro-photo::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 150%;
  height: 100%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  transform: translateX(-150%) skewX(-20deg);
  transition: transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.intro-photo:hover::after {
  transform: translateX(100%) skewX(-20deg);
}

/* ===== TOMBOL (BUTTONS) ===== */
.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn svg {
  width: 1.2rem;
  height: 1.2rem;
}

.btn-primary {
  background: var(--pikachu-yellow);
  color: var(--bg-dark);
  border: 2px solid var(--pikachu-yellow);
}

.btn-primary:hover {
  transform: translateY(-3px);
  color: var(--text-white);
  border-color: var(--text-white);
  box-shadow: 0 4px 20px rgba(0, 204, 255, 0.4);
  background: linear-gradient(45deg, rgba(0, 217, 255, 0.8), rgba(76, 0, 255, 0.2));
}

.btn-secondary {
  background: transparent;
  color: var(--text-white);
  border: 2px solid rgb(75, 85, 99);
}

.btn-secondary:hover {
  border-color: var(--pikachu-yellow);
  color: var(--pikachu-yellow);
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
}

/* ===== KARTU STATISTIK (STAT ITEMS) ===== */
.stat-item {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgb(75, 85, 99);
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-item:hover {
  transform: translateY(-5px);
  border-color: var(--pikachu-yellow);
}

.stat-icon-wrapper {
  color: var(--pikachu-yellow);
  width: 32px;
  height: 32px;
  margin-bottom: 1rem;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-white);
}

.stat-title {
  font-weight: 500;
  margin-top: 0.5rem;
  color: rgb(209, 213, 219);
}

.stat-desc {
  font-size: 0.875rem;
  color: rgb(156, 163, 175);
}

.stat-arrow {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  font-size: 1.2rem;
  color: var(--pikachu-yellow);
  transform: rotate(-45deg);
  transition: transform 0.3s ease;
}

.stat-item:hover .stat-arrow {
  transform: rotate(0deg);
}

/* ===== ANIMASI (DIREFAKTOR) ===== */
.animated-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.from-left {
  transform: translateX(-50px);
}

.from-right {
  transform: translateX(50px);
}

#about.in-view .animated-item {
  opacity: 1;
  transform: translate(0, 0);
}

/* Delay diatur berdasarkan urutan elemen di dalam parent-nya */
#about.in-view .animated-item:nth-of-type(1) { transition-delay: 0.2s; }
#about.in-view .animated-item:nth-of-type(2) { transition-delay: 0.4s; }
#about.in-view .animated-item:nth-of-type(3) { transition-delay: 0.6s; }
#about.in-view .animated-item:nth-of-type(4) { transition-delay: 0.8s; }
#about.in-view .animated-item:nth-of-type(5) { transition-delay: 1.0s; }
#about.in-view .stats-grid .animated-item:nth-of-type(1) { transition-delay: 1.0s; }
#about.in-view .stats-grid .animated-item:nth-of-type(2) { transition-delay: 1.2s; }
#about.in-view .stats-grid .animated-item:nth-of-type(3) { transition-delay: 1.4s; }

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .intro-flex {
    flex-direction: column-reverse;
    text-align: center;
  }
  .intro-photo {
    margin: 0 auto 2rem;
    max-width: 250px;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1024px) {
  .bio,
  .quote {
    max-width: 650px;
  }
}
</style>