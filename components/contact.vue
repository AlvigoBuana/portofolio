<template>
  <section id="contact" ref="contactSectionRef">
    <div class="content-wrapper">

      <div class="title-block">
        <h2 class="section-title">Contact Me</h2>
        <p class="subtitle">Let's connect, collaborate, or just say hello!</p>
      </div>

      <div class="main-container">

        <div class="card-glass form-card">
          <div class="column-header">
            <div class="icon-wrapper">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 class="column-title">Send Message</h3>
          </div>

          <form @submit.prevent="sendEmail" ref="formRef" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" v-model="form.name" required placeholder="What's your name?">
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" v-model="form.email" required placeholder="Your email address">
              </div>
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" name="message" v-model="form.message" rows="6" required placeholder="Write your message here..."></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit" :disabled="isLoading">
                <span v-if="!isLoading">Send Message</span>
                <span v-else>Sending...</span>
                <svg v-if="!isLoading" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                <svg v-else class="animate-spin ml-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </button>
            </div>

            <p v-if="statusMessage" :class="['status-msg', statusType]">
              {{ statusMessage }}
            </p>
          </form>
        </div>

        <div class="card-glass guestbook-card">
          <div class="column-header">
            <div class="icon-wrapper">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            </div>
            <h3 class="column-title">Guestbook</h3>
          </div>
          <p class="guestbook-desc">Leave a comment using your GitHub account!</p>

          <div class="giscus-wrapper">
            <ClientOnly>
              <Giscus
                id="comments"
                repo="AlvigoBuana/portofolio"
                repoId="R_kgDOPcId-A"
                category="General"
                categoryId="DIC_kwDOPcId-M4Cy4Lo"
                mapping="pathname"
                strict="0"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="dark_dimmed"
                lang="en"
                loading="lazy"
              />
            </ClientOnly>
          </div>
        </div>

      </div>

      <div class="bottom-grid">
        <div class="find-me">
          <h3 class="footer-col-title">Find Me</h3>
          <div class="social-links">
            <a v-for="social in findMeLinks" :key="social.name" :href="social.href" class="social-link" target="_blank" rel="noopener noreferrer" :title="social.name">
              <img :src="social.image" :alt="social.name" class="social-icon" />
            </a>
          </div>
        </div>
        <div class="play-games">
          <h3 class="footer-col-title">Play some Games ?</h3>
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
import emailjs from '@emailjs/browser';
import Giscus from '@giscus/vue';

const contactSectionRef = ref(null);
let observer = null;

const findMeLinks = ref([
  { name: 'GitHub', href: 'https://github.com/AlvigoBuana', image: '/github.svg' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/alvigo-wahyu-buana-83bb712b6/', image: '/linkedin.svg' },
  { name: 'YouTube', href: 'https://www.youtube.com/@alvigowb', image: '/yt.svg' },
  { name: 'Instagram', href: 'https://instagram.com/alvgwb_', image: '/instagram.svg' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@alvigowb', image: '/tiktok.svg' },
  { name: 'Email', href: 'mailto:alvigowb@gmail.com', image: '/gmail.svg' }
]);

const gamingLinks = ref([
  { name: 'Discord', href: '#', image: '/discord.svg' },
  { name: 'Steam', href: 'https://s.team/p/jqqr-rvwf/WQKNJKMD', image: '/steam.svg' },
  { name: 'Spotify', href: '#', image: '/spotify.svg' },
]);

const formRef = ref(null);
const isLoading = ref(false);
const statusMessage = ref('');
const statusType = ref('');
const form = ref({ name: '', email: '', message: '' });

const sendEmail = () => {
  isLoading.value = true;
  statusMessage.value = '';

  // Pastikan ID ini sesuai dengan akun EmailJS Abang
  const SERVICE_ID = 'service_z8h4k2a';
  const TEMPLATE_ID = 'template_b9x2m1q';
  const PUBLIC_KEY = 'A8n2_kL92s1s';

  const templateParams = {
    name: form.value.name,
    email: form.value.email,
    message: form.value.message
  };

  emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
    .then((result) => {
      statusMessage.value = 'Message sent successfully!';
      statusType.value = 'success';
      form.value = { name: '', email: '', message: '' };
    }, (error) => {
      statusMessage.value = 'Failed to send message.';
      statusType.value = 'error';
    })
    .finally(() => {
      isLoading.value = false;
      setTimeout(() => { statusMessage.value = ''; }, 5000);
    });
};

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.1 });

  if (contactSectionRef.value) { observer.observe(contactSectionRef.value); }
});

onBeforeUnmount(() => { if (observer) observer.disconnect(); });
</script>

<style scoped>
#contact {
  padding-top: 50px;
  padding-bottom: 100px;
  scroll-margin-top: 80px;
}
.content-wrapper {
  max-width: 1400px; /* Lebar wrapper utama */
  margin: 0 auto;
  padding: 0 2rem;
}

.title-block { text-align: center; margin-bottom: 4rem; }
.section-title { font-size: 3rem; font-weight: 700; color: var(--text-white); margin-bottom: 0.5rem; }
.subtitle { color: rgb(209, 213, 219); }

/* ==== MAIN CONTAINER (FULL WIDTH) ==== */
.main-container {
  display: flex;
  flex-direction: column;
  gap: 3rem; /* Jarak antar card */
  width: 100%; /* Ambil lebar penuh content-wrapper */
  /* Hapus max-width yang membatasi sebelumnya */
}

/* Card Style (Glassmorphism) */
.card-glass {
  background: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%; /* Card melebar penuh */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.card-glass:hover {
  border-color: rgba(255, 215, 0, 0.3);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* Header Kolom */
.column-header {
  display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 1rem;
}
.icon-wrapper {
  width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  background: rgba(255, 215, 0, 0.1); border-radius: 8px; color: var(--pikachu-yellow);
}
.icon-wrapper svg { width: 1.2rem; height: 1.2rem; }
.column-title { font-size: 1.5rem; font-weight: 600; color: var(--text-white); margin: 0; }

/* ==== FORM STYLING ==== */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.form-group { margin-bottom: 1.5rem; }
.form-group label {
  display: block; margin-bottom: 0.5rem; font-size: 0.9rem;
  font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;
}
.form-group input, .form-group textarea {
  width: 100%; padding: 0.85rem 1rem; border-radius: 8px;
  background: #0f0f0f; border: 1px solid #374151;
  color: var(--text-white); font-family: 'Rajdhani', sans-serif; font-size: 1rem;
  transition: all 0.3s ease;
}
.form-group input:focus, .form-group textarea:focus {
  outline: none; border-color: var(--pikachu-yellow); background: #141414;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
}

/* BUTTON */
.form-actions {
  display: flex;
  justify-content: flex-start;
}
.btn-submit {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem;
  padding: 0.8rem 2.5rem;
  min-width: 180px;
  border-radius: 8px; font-weight: 700; cursor: pointer;
  background: var(--pikachu-yellow); color: #000; border: none;
  transition: all 0.3s ease; font-family: 'Rajdhani', sans-serif; font-size: 1rem;
  text-transform: uppercase; letter-spacing: 1px;
}
.btn-submit:hover:not(:disabled) {
  background: #e6c200; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-submit svg {
  width: 1.2rem;
  height: 1.2rem;
  transform: rotate(45deg);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-submit:hover svg {
  transform: rotate(90deg) translateX(-2px);
}

.btn-submit .animate-spin {
  transform: none;
}
.status-msg { margin-top: 1rem; font-weight: 600; font-size: 0.9rem; }
.status-msg.success { color: #4ade80; }
.status-msg.error { color: #f87171; }

/* ==== GUESTBOOK ==== */
.guestbook-desc { color: #9ca3af; margin-bottom: 1.5rem; font-size: 0.95rem; }
.giscus-wrapper { background: rgba(0, 0, 0, 0.2); padding: 1rem; border-radius: 12px; }

/* ==== SOCIALS ==== */
.bottom-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
  margin-top: 5rem; padding-top: 3rem; border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.find-me, .play-games { display: flex; flex-direction: column; align-items: center; }
.footer-col-title { font-size: 1.2rem; font-weight: 600; color: var(--pikachu-yellow); margin-bottom: 1.5rem; }
.social-links { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }

.social-link {
  display: flex; align-items: center; justify-content: center;
  width: 45px; height: 45px; border-radius: 50%;
  border: 1px solid rgb(75, 85, 99); background: rgba(31, 41, 55, 0.5);
  transition: all 0.3s ease;
}
.social-link:hover { border-color: var(--pikachu-yellow); transform: scale(1.1); }
.social-icon { width: 22px; height: 22px; }

/* Animasi */
.title-block, .main-container, .bottom-grid {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
#contact.in-view .title-block { opacity: 1; transform: translateY(0); }
#contact.in-view .main-container { opacity: 1; transform: translateY(0); transition-delay: 0.2s; }
#contact.in-view .bottom-grid { opacity: 1; transform: translateY(0); transition-delay: 0.4s; }

/* Responsive */
@media (max-width: 768px) {
  .form-row { grid-template-columns: 1fr; gap: 1.5rem; }
  .bottom-grid { grid-template-columns: 1fr; gap: 3rem; }
  .card-glass { padding: 1.5rem; }
}
</style>