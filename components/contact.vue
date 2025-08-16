<template>
  <section id="contact" ref="contactSectionRef">
    <div class="content-wrapper">
      <div class="title-block">
        <h2 class="section-title">Contact Me</h2>
        <p class="subtitle">Let's connect with me</p>
      </div>

      <div class="contact-form-container">
        <h3 class="column-title">Message Me</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Your Name</label>
              <input type="text" id="name" name="name" required placeholder="Enter your name">
            </div>
            <div class="form-group">
              <label for="email">Your Email</label>
              <input type="email" id="email" name="email" required placeholder="Enter your email">
            </div>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="6" required placeholder="How can I help you?"></textarea>
          </div>
          <button type="submit" class="btn-submit">
            <span>Send Message</span>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
      </div>

      <div class="bottom-grid">
        <div class="find-me">
          <h3 class="column-title">Find Me</h3>
          <div class="social-links">
            <a v-for="social in findMeLinks" :key="social.name" :href="social.href" class="social-link" target="_blank" rel="noopener noreferrer" :title="social.name">
              <img :src="social.image" :alt="social.name" class="social-icon" />
            </a>
          </div>
        </div>
        <div class="play-games">
          <h3 class="column-title">Play some Games ?</h3>
          <div class="social-links">
            <a v-for="social in gamingLinks" :key="social.name" :href="social.href" class="social-link" target="_blank" rel="noopener noreferrer" :title="social.name">
              <img :src="social.image" :alt="social.name" class="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const findMeLinks = ref([
  { name: 'GitHub', href: 'https://github.com/AlvigoBuana', image: '/github.svg' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/alvigo-wahyu-buana-83bb712b6/', image: '/linkedin.svg' },
  { name: 'YouTube', href: 'https://www.youtube.com/@alvigowb', image: 'yt.svg' },
  { name: 'Instagram', href: 'https://instagram.com/alvgwb_', image: '/instagram.svg' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@alvigowb', image: '/tiktok.svg' },
  { name: 'Email',  image: '/gmail.svg' }
]);

const gamingLinks = ref([
  { name: 'Discord',  image: '/discord.svg',  },
  { name: 'Steam', href: 'https://s.team/p/jqqr-rvwf/WQKNJKMD', image: '/steam.svg' },
  { name: 'Spotify',  image: '/spotify.svg' },
]);

const handleSubmit = (event) => {
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  console.log('Form data:', data);
  alert('Thank you for your message! (This is a demo, the form is not sent)');
  event.target.reset();
};

const contactSectionRef = ref(null);
let observer;
let lastScrollY = window.scrollY;
let scrollDirection = 'down';
const handleWindowScroll = () => { if (window.scrollY > lastScrollY) { scrollDirection = 'down'; } else { scrollDirection = 'up'; } lastScrollY = window.scrollY; };
const handleIntersection = (entries) => { const entry = entries[0]; if (entry.isIntersecting) { entry.target.classList.add('in-view'); } else { if (scrollDirection === 'up') { entry.target.classList.remove('in-view'); } } };
onMounted(() => {
  window.addEventListener('scroll', handleWindowScroll);
  observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
  if (contactSectionRef.value) { observer.observe(contactSectionRef.value); }
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleWindowScroll);
  if (observer) { observer.disconnect(); }
});
</script>

<style scoped>
#contact {
  padding-top: 50px;
  padding-bottom: 100px;
  scroll-margin-top: 80px; 
}
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.title-block { text-align: center; margin-bottom: 3rem; }
.section-title { font-size: 3rem; font-weight: 700; color: var(--text-white); margin-bottom: 0.5rem; }
.subtitle { color: rgb(209, 213, 219); max-width: 450px; margin: 0 auto 4rem; }

/* --- Layout Baru --- */
.contact-form-container {
  max-width: 800px;
  margin: 0 auto;
}
.column-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--pikachu-yellow);
  margin-bottom: 1.5rem;
  text-align: center;
}
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 1px solid rgb(55, 65, 81);
}
.find-me, .play-games {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid rgb(75, 85, 99);
  background: rgba(31, 41, 55, 0.5);
  transition: all 0.3s ease;
}
.social-link:hover {
  border-color: var(--pikachu-yellow);
  transform: scale(1.1);
}
.social-icon {
  width: 22px;
  height: 22px;
}

/* Form Styling */
.contact-form-container form {
  background: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 2.5rem;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: rgb(209, 213, 219); }
.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: #1c1c1c;
  border: 1px solid rgb(55, 65, 81);
  color: var(--text-white);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--pikachu-yellow); box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
.btn-submit {
  display: inline-flex; align-items: center; gap: 0.75rem; width: 100%; justify-content: center; padding: 0.85rem 2rem;
  border-radius: 0.5rem; font-weight: 700; cursor: pointer; background: var(--pikachu-yellow); color: var(--bg-dark);
  border: 2px solid var(--pikachu-yellow); transition: all 0.3s ease; font-family: 'Rajdhani', sans-serif; font-size: 1.1rem;
}
.btn-submit:hover { transform: translateY(-3px); box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4); }
.btn-submit svg { width: 1.2rem; height: 1.2rem; }

/* Animasi Scroll */
.title-block, .contact-form-container, .bottom-grid {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
#contact.in-view .title-block { opacity: 1; transform: translateY(0); }
#contact.in-view .contact-form-container { opacity: 1; transform: translateY(0); transition-delay: 0.2s; }
#contact.in-view .bottom-grid { opacity: 1; transform: translateY(0); transition-delay: 0.4s; }

/* Responsive */
@media (max-width: 768px) {
  .bottom-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>