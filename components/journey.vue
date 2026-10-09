<template>
  <section
    id="journey"
    ref="journeySectionRef"
    class="journey-section"
    :class="{ 'is-revealed': isJourneyRevealed }"
  >
    <span id="portofolio" class="journey-legacy-anchor" aria-hidden="true"></span>

    <video
      class="journey-video"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      aria-hidden="true"
      tabindex="-1"
      @error="handleVideoError"
    >
      <source src="/JourneyClip.mp4" type="video/mp4">
    </video>
    <div class="journey-video-overlay" aria-hidden="true"></div>

    <div class="journey-layout" :inert="!isJourneyRevealed">
      <div class="journey-work">
        <header class="journey-heading">
          <p class="journey-kicker">Selected work · A work in progress</p>
          <h2>The Journey</h2>
          <p class="journey-intro">
            A few projects from the path so far. There is always more to make.
          </p>
        </header>

        <div
          class="journey-carousel"
          role="region"
          aria-label="Project showcase"
          aria-roledescription="carousel"
          tabindex="0"
          :class="{ 'is-dragging': dragPointerId !== null }"
          @pointerdown="startDrag"
          @pointerup="finishDrag"
          @pointercancel="cancelDrag"
          @keydown.left.prevent="showPreviousProject"
          @keydown.right.prevent="showNextProject"
        >
          <article
            v-for="card in visibleProjects"
            :key="card.project.id"
            class="project-card"
            :class="[
              `project-card--${card.position}`,
              { 'coming-soon': card.project.isComingSoon },
            ]"
            :aria-label="`Project ${card.index + 1} of ${projects.length}: ${card.project.title}`"
            :aria-current="card.position === 'center' ? 'true' : undefined"
            @click="handleCardClick(card.index, card.position)"
          >
            <div class="project-image-wrapper">
              <img
                :src="card.project.imageUrl"
                :alt="`${card.project.title} project preview`"
                class="project-image"
                loading="lazy"
                draggable="false"
              >
              <span v-if="card.project.isComingSoon" class="coming-soon-label">
                Coming soon
              </span>
              <span class="project-counter">
                {{ String(card.index + 1).padStart(2, '0') }}
                <span>/ {{ String(projects.length).padStart(2, '0') }}</span>
              </span>
            </div>

            <div class="project-info">
              <h3 class="project-title">{{ card.project.title }}</h3>
              <p class="project-description">{{ card.project.description }}</p>

              <ul class="project-tech" aria-label="Technologies">
                <li v-for="technology in card.project.tech" :key="technology">
                  {{ technology }}
                </li>
              </ul>

              <div v-if="card.position === 'center'" class="project-card-footer">
                <div
                  v-if="!card.project.isComingSoon && (card.project.liveUrl || card.project.repoUrl)"
                  class="project-links"
                >
                  <a
                    v-if="card.project.liveUrl"
                    :href="card.project.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                    @pointerdown.stop
                  >
                    Live Demo <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    v-if="card.project.repoUrl"
                    :href="card.project.repoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                    @pointerdown.stop
                  >
                    Details <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </article>

          <div class="carousel-controls" aria-label="Project navigation">
            <button type="button" class="carousel-arrow" aria-label="Previous project" @pointerdown.stop @click.stop="showPreviousProject">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button type="button" class="carousel-arrow" aria-label="Next project" @pointerdown.stop @click.stop="showNextProject">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          <div class="carousel-pagination" aria-label="Choose a project">
            <button
              v-for="(project, index) in projects"
              :key="project.id"
              type="button"
              :class="{ active: index === activeProjectIndex }"
              :aria-label="`Show project ${index + 1}: ${project.title}`"
              :aria-current="index === activeProjectIndex ? 'true' : undefined"
              @click="showProject(index)"
            ></button>
          </div>
        </div>
      </div>

    </div>

    <aside class="journey-video-caption" aria-hidden="true">
      <span>Keep moving forward</span>
      <span class="caption-rule"></span>
    </aside>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { projectsData } from '~/utils/projectData.js';

const projects = projectsData;
const journeySectionRef = ref(null);
const isJourneyRevealed = ref(false);
let journeyObserver = null;
const activeProjectIndex = ref(0);
const visibleProjects = computed(() => {
  if (projects.length < 2) {
    return projects.map((project, index) => ({ project, index, position: 'center' }));
  }

  const previousIndex = (activeProjectIndex.value - 1 + projects.length) % projects.length;
  const nextIndex = (activeProjectIndex.value + 1) % projects.length;

  return [
    { project: projects[previousIndex], index: previousIndex, position: 'left' },
    { project: projects[activeProjectIndex.value], index: activeProjectIndex.value, position: 'center' },
    { project: projects[nextIndex], index: nextIndex, position: 'right' },
  ];
});
let dragStartX = 0;
const dragPointerId = ref(null);
let suppressCardClick = false;

const showProject = (index) => {
  const nextIndex = (index + projects.length) % projects.length;
  if (nextIndex === activeProjectIndex.value) return;

  activeProjectIndex.value = nextIndex;
};

const handleCardClick = (index, position) => {
  if (suppressCardClick) {
    suppressCardClick = false;
    return;
  }

  if (position !== 'center') {
    showProject(index);
  }
};

const showPreviousProject = () => {
  showProject(activeProjectIndex.value - 1);
};

const showNextProject = () => {
  showProject(activeProjectIndex.value + 1);
};

const startDrag = (event) => {
  if (
    event.button !== 0 ||
    event.target instanceof Element && event.target.closest('a, button')
  ) return;

  dragStartX = event.clientX;
  dragPointerId.value = event.pointerId;
  const captureTarget = event.target instanceof Element
    ? event.target.closest('.project-card') ?? event.currentTarget
    : event.currentTarget;
  captureTarget.setPointerCapture(event.pointerId);
};

const finishDrag = (event) => {
  if (dragPointerId.value !== event.pointerId) return;

  const distance = event.clientX - dragStartX;
  dragPointerId.value = null;
  if (Math.abs(distance) < 48) return;

  suppressCardClick = true;
  if (distance < 0) {
    showNextProject();
  } else {
    showPreviousProject();
  }

  window.setTimeout(() => {
    suppressCardClick = false;
  }, 250);
};

const cancelDrag = (event) => {
  if (dragPointerId.value === event.pointerId) {
    dragPointerId.value = null;
  }
};

const handleVideoError = (event) => {
  const video = event.currentTarget;
  console.error('Journey background video could not be loaded.', {
    source: video.currentSrc,
    mediaErrorCode: video.error?.code,
    mediaErrorMessage: video.error?.message,
  });
};

const observeJourneyVisibility = () => {
  if (!journeySectionRef.value) return;

  journeyObserver?.disconnect();
  const fullViewThreshold = window.innerWidth > 992 ? 0.95 : 0.1;
  journeyObserver = new IntersectionObserver(([entry]) => {
    isJourneyRevealed.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || entry.isIntersecting && entry.intersectionRatio >= fullViewThreshold;
  }, { threshold: [0.1, 0.95] });

  journeyObserver.observe(journeySectionRef.value);
};

onMounted(() => {
  observeJourneyVisibility();
  window.addEventListener('resize', observeJourneyVisibility);
});

onBeforeUnmount(() => {
  journeyObserver?.disconnect();
  window.removeEventListener('resize', observeJourneyVisibility);
});
</script>

<style scoped>
.journey-section {
  position: relative;
  z-index: 0;
  isolation: isolate;
  display: flex;
  min-height: 100svh;
  align-items: center;
  overflow: hidden;
  padding: clamp(3rem, 7vh, 5rem) clamp(1.25rem, 5vw, 5rem);
  background: #090b0e;
}

.journey-legacy-anchor {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
}

.journey-video {
  position: absolute;
  inset: 0 0 0 60%;
  z-index: -2;
  width: 40%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
}

.journey-video-overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, #090b0e 0%, rgba(9, 11, 14, 0.98) 40%, rgba(9, 11, 14, 0.78) 59%, rgba(9, 11, 14, 0.16) 100%),
    linear-gradient(0deg, rgba(9, 11, 14, 0.52), transparent 45%, rgba(9, 11, 14, 0.32));
  pointer-events: none;
}

.journey-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(1.5rem, 4vw, 4rem);
  width: min(100%, 1440px);
  height: min(76svh, 720px);
  min-height: 0;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(1.25rem);
  transition:
    opacity 700ms ease,
    transform 700ms cubic-bezier(0.2, 0.8, 0.25, 1);
}

.journey-section.is-revealed .journey-layout,
.journey-section.is-revealed .journey-video-caption {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.journey-work {
  display: flex;
  height: 100%;
  flex-direction: column;
  grid-column: 1;
  min-width: 0;
  min-height: 0;
}

.journey-heading {
  margin-bottom: clamp(1.25rem, 3vh, 2.25rem);
}

.journey-kicker {
  margin-bottom: 0.5rem;
  color: var(--pikachu-yellow);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.journey-heading h2 {
  color: var(--text-white);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.5rem, 5vw, 4.75rem);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 1;
}

.journey-intro {
  max-width: 38rem;
  margin-top: 0.75rem;
  color: rgba(243, 239, 228, 0.65);
}

.journey-carousel {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  width: 100%;
}

.project-card {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  height: 100%;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  border: 1px solid rgba(215, 181, 109, 0.25);
  border-radius: 0.9rem;
  background: rgba(15, 17, 20, 0.83);
  box-shadow: 0 1.25rem 3.5rem rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(14px);
}

.project-image-wrapper {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-right: 1px solid rgba(215, 181, 109, 0.16);
  background: rgba(0, 0, 0, 0.25);
}

.project-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms ease;
}

.project-card:hover .project-image {
  transform: scale(1.035);
}

.coming-soon .project-image {
  filter: grayscale(100%) blur(2px);
  opacity: 0.6;
}

.coming-soon-label {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  background: rgba(10, 10, 10, 0.78);
  color: var(--text-white);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.project-info {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: clamp(1.25rem, 2.5vw, 2.5rem);
}

.project-counter {
  margin-bottom: 0.8rem;
  color: var(--pikachu-yellow);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.project-counter span {
  color: rgba(243, 239, 228, 0.42);
}

.project-title {
  margin-bottom: 0.65rem;
  color: var(--text-white);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.35rem, 2.3vw, 2.1rem);
  font-weight: 400;
  line-height: 1.15;
}

.project-description {
  color: rgba(243, 239, 228, 0.72);
  font-size: 0.9rem;
  line-height: 1.65;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 1rem 0 1.4rem;
  padding: 0;
  list-style: none;
}

.project-tech li {
  padding: 0.25rem 0.55rem;
  border: 1px solid rgba(215, 181, 109, 0.27);
  border-radius: 999px;
  color: rgba(243, 239, 228, 0.78);
  font-size: 0.72rem;
}

.project-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.project-link {
  color: var(--pikachu-yellow);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.project-link:hover {
  color: var(--pikachu-light);
}

.carousel-controls {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
  margin-left: auto;
}

.carousel-arrow {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border: 1px solid rgba(215, 181, 109, 0.4);
  border-radius: 50%;
  background: rgba(9, 11, 14, 0.8);
  color: var(--text-white);
  cursor: pointer;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.carousel-arrow:hover {
  transform: translateY(-2px);
  border-color: var(--pikachu-yellow);
  background: var(--pikachu-yellow);
  color: #090b0e;
}

.carousel-arrow svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.carousel-pagination {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.carousel-pagination button {
  width: 1.5rem;
  height: 3px;
  padding: 0;
  border: 0;
  background: rgba(243, 239, 228, 0.28);
  cursor: pointer;
  transition: width 220ms ease, background-color 220ms ease;
}

.carousel-pagination button.active {
  width: 2.75rem;
  background: var(--pikachu-yellow);
}

.journey-video-caption {
  grid-column: 2;
  display: flex;
  align-self: end;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-bottom: 1rem;
  color: rgba(243, 239, 228, 0.72);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.journey-video-caption {
  opacity: 0;
  transform: translateY(1rem);
  transition:
    opacity 700ms ease 180ms,
    transform 700ms cubic-bezier(0.2, 0.8, 0.25, 1) 180ms;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .journey-layout,
  .journey-section.is-revealed .journey-layout,
  .journey-video-caption,
  .journey-section.is-revealed .journey-video-caption {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.caption-rule {
  width: 2.5rem;
  height: 1px;
  background: var(--pikachu-yellow);
}

.project-slide-next-enter-active,
.project-slide-next-leave-active,
.project-slide-previous-enter-active,
.project-slide-previous-leave-active {
  transition: opacity 220ms ease, transform 260ms ease;
}

.project-slide-next-enter-from {
  opacity: 0;
  transform: translateX(1.25rem);
}

.project-slide-next-leave-to {
  opacity: 0;
  transform: translateX(-1.25rem);
}

.project-slide-previous-enter-from {
  opacity: 0;
  transform: translateX(-1.25rem);
}

.project-slide-previous-leave-to {
  opacity: 0;
  transform: translateX(1.25rem);
}

@media (max-width: 900px) {
  .journey-section {
    padding-inline: 1.25rem;
  }

  .journey-layout {
    height: min(76svh, 720px);
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 1.25rem;
  }

  .project-card {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  }

  .project-info {
    padding: 1.15rem;
  }
}

@media (max-width: 680px) {
  .journey-section {
    min-height: 100svh;
    padding: 5.5rem 1rem 2rem;
  }

  .journey-video {
    inset: 0;
    width: 100%;
    opacity: 0.35;
  }

  .journey-video-overlay {
    background:
      linear-gradient(90deg, rgba(9, 11, 14, 0.94), rgba(9, 11, 14, 0.62)),
      linear-gradient(0deg, rgba(9, 11, 14, 0.78), rgba(9, 11, 14, 0.3));
  }

  .journey-layout {
    display: block;
    height: auto;
    min-height: 0;
    width: 100%;
  }

  .journey-work {
    height: auto;
  }

  .journey-heading {
    margin-bottom: 1.25rem;
  }

  .journey-heading h2 {
    font-size: clamp(2.5rem, 12vw, 4rem);
  }

  .journey-intro {
    max-width: 28rem;
    font-size: 0.9rem;
  }

  .journey-carousel {
    display: block;
  }

  .project-card {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(180px, 30svh) auto;
    height: auto;
    min-height: 0;
    flex: none;
  }

  .project-image-wrapper {
    border-right: 0;
    border-bottom: 1px solid rgba(215, 181, 109, 0.16);
  }

  .project-info {
    height: auto;
    min-height: 245px;
    padding: 1rem 1.1rem;
  }

  .project-counter {
    margin-bottom: 0.4rem;
  }

  .project-title {
    font-size: clamp(1.35rem, 7vw, 1.8rem);
  }

  .project-description {
    font-size: 0.83rem;
    line-height: 1.5;
  }

  .project-tech {
    margin: 0.75rem 0 1rem;
  }

  .journey-video-caption {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-image,
  .carousel-arrow,
  .carousel-pagination button {
    transition: none;
  }

  .project-slide-next-enter-active,
  .project-slide-next-leave-active,
  .project-slide-previous-enter-active,
  .project-slide-previous-leave-active {
    transition: none;
  }
}

/* Three-card draggable carousel and softly blended video backdrop. */
.journey-video {
  inset: 0;
  width: 100%;
  opacity: 0.48;
  filter: saturate(0.82) contrast(1.04);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 30%, #000 78%);
  mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 30%, #000 78%);
}

.journey-video-overlay {
  background:
    linear-gradient(90deg, #090b0e 0%, rgba(9, 11, 14, 0.98) 27%, rgba(9, 11, 14, 0.86) 48%, rgba(9, 11, 14, 0.42) 76%, rgba(9, 11, 14, 0.14) 100%),
    linear-gradient(0deg, rgba(9, 11, 14, 0.62), transparent 40%, rgba(9, 11, 14, 0.42));
}

.journey-carousel {
  position: relative;
  overflow: visible;
  outline: none;
  perspective: 1000px;
  touch-action: pan-y;
  cursor: grab;
}

.journey-carousel:focus-visible {
  border-radius: 1rem;
  outline: 1px solid rgba(215, 181, 109, 0.5);
  outline-offset: 0.4rem;
}

.journey-carousel.is-dragging {
  cursor: grabbing;
  user-select: none;
}

.journey-carousel.is-dragging .project-card {
  transition-duration: 180ms;
}

.project-card {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  width: clamp(180px, 18.5vw, 270px);
  height: min(58svh, 540px);
  flex: none;
  flex-direction: column;
  border-color: rgba(215, 181, 109, 0.28);
  border-radius: 1rem;
  background: linear-gradient(160deg, rgba(25, 27, 30, 0.96), rgba(11, 13, 16, 0.97));
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.48);
  transform-origin: center center;
  transition:
    transform 480ms cubic-bezier(0.2, 0.75, 0.25, 1),
    opacity 380ms ease,
    filter 380ms ease,
    box-shadow 380ms ease;
  cursor: pointer;
}

.project-card--center {
  z-index: 3;
  opacity: 1;
  filter: none;
  transform: translate(-50%, -50%) scale(1);
  cursor: grab;
}

.project-card--left {
  z-index: 2;
  opacity: 0.68;
  filter: saturate(0.72) brightness(0.78);
  transform: translate(calc(-50% - 82%), -50%) scale(0.82);
}

.project-card--right {
  z-index: 2;
  opacity: 0.68;
  filter: saturate(0.72) brightness(0.78);
  transform: translate(calc(-50% + 82%), -50%) scale(0.82);
}

.project-card--left:hover,
.project-card--right:hover {
  z-index: 4;
  opacity: 0.9;
  filter: saturate(0.9) brightness(0.92);
}

.project-card--left:hover {
  transform: translate(calc(-50% - 82%), -50%) scale(0.86);
}

.project-card--right:hover {
  transform: translate(calc(-50% + 82%), -50%) scale(0.86);
}

.project-image-wrapper {
  flex: 0 0 54%;
  border: 0;
  border-bottom: 1px solid rgba(215, 181, 109, 0.18);
  background: #111317;
}

.project-image {
  object-fit: cover;
}

.project-image-wrapper::after {
  position: absolute;
  inset: 35% 0 0;
  content: '';
  background: linear-gradient(transparent, rgba(9, 11, 14, 0.65));
  pointer-events: none;
}

.project-counter {
  position: absolute;
  z-index: 1;
  bottom: 0.85rem;
  left: 1rem;
  margin: 0;
  color: var(--text-white);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8);
}

.project-info {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  padding: 1rem 1.1rem 1.1rem;
}

.project-title {
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 0.45rem;
  font-size: clamp(1rem, 1.35vw, 1.3rem);
  line-height: 1.2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.project-description {
  display: -webkit-box;
  overflow: hidden;
  font-size: 0.76rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.project-tech {
  gap: 0.35rem;
  margin: 0.7rem 0 0.85rem;
}

.project-tech li {
  padding: 0.2rem 0.45rem;
  font-size: 0.65rem;
}

.project-card-footer {
  gap: 0.5rem;
}

.project-links {
  gap: 0.65rem;
}

.project-link {
  font-size: 0.7rem;
}

.carousel-controls {
  gap: 0.35rem;
}

.carousel-arrow {
  width: 2rem;
  height: 2rem;
}

.carousel-arrow svg {
  width: 0.85rem;
  height: 0.85rem;
}

.carousel-pagination {
  position: relative;
  z-index: 5;
  justify-content: center;
}

.journey-video-caption {
  position: relative;
  z-index: 1;
}

@media (max-width: 900px) and (min-width: 681px) {
  .project-card {
    width: clamp(175px, 22vw, 230px);
    height: min(54svh, 470px);
  }
}

@media (max-width: 680px) {
  .journey-section {
    margin-top: 0;
  }

  .journey-video {
    inset: 0;
    width: 100%;
    opacity: 0.36;
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 35%, #000 100%);
    mask-image: linear-gradient(180deg, transparent 0%, #000 35%, #000 100%);
  }

  .journey-video-overlay {
    background:
      linear-gradient(180deg, #090b0e 0%, rgba(9, 11, 14, 0.84) 30%, rgba(9, 11, 14, 0.58) 100%),
      linear-gradient(90deg, rgba(9, 11, 14, 0.62), transparent);
  }

  .journey-carousel {
    flex: none;
    height: clamp(450px, 62svh, 560px);
    margin-inline: -0.5rem;
  }

  .project-card {
    width: clamp(175px, 55vw, 235px);
    height: min(56svh, 500px);
    max-height: 500px;
  }

  .project-card--left {
    transform: translate(calc(-50% - 79%), -50%) scale(0.78);
  }

  .project-card--right {
    transform: translate(calc(-50% + 79%), -50%) scale(0.78);
  }

  .project-card--left:hover {
    transform: translate(calc(-50% - 79%), -50%) scale(0.81);
  }

  .project-card--right:hover {
    transform: translate(calc(-50% + 79%), -50%) scale(0.81);
  }

  .project-image-wrapper {
    flex-basis: 50%;
  }

  .project-info {
    min-height: 0;
    padding: 0.8rem;
  }

  .project-title {
    font-size: 1rem;
  }

  .project-description {
    font-size: 0.68rem;
    -webkit-line-clamp: 3;
  }

  .project-tech {
    margin: 0.55rem 0 0.7rem;
  }

  .project-card-footer {
    align-items: flex-end;
  }

  .project-links {
    flex-direction: column;
    gap: 0.3rem;
  }

  .carousel-arrow {
    width: 1.8rem;
    height: 1.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card {
    transition: none;
  }
}

.journey-video {
  position: absolute;
  inset: 0 0 0 42%;
  z-index: -2;
  width: 58%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 1;
  filter: saturate(0.82) contrast(1.04);
  pointer-events: none;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 25%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 25%);
}

.journey-video-overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    90deg,
    #090b0e 0%,
    #090b0e 42%,
    rgba(9, 11, 14, 0.7) 50%,
    rgba(9, 11, 14, 0.2) 70%,
    transparent 100%
  );
  pointer-events: none;
}

.journey-video-caption {
  position: absolute;
  right: clamp(1.25rem, 5vw, 5rem);
  bottom: 1rem;
  white-space: nowrap;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(243, 239, 228, 0.72);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

@media (min-width: 769px) {
  .journey-section {
    margin-top: -100svh;
  }
}

.journey-work {
  position: relative;
  z-index: 2;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  margin: 0;
  transform: translateY(-50%);
  pointer-events: none;
}

.carousel-arrow {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  border: 1px solid rgba(215, 181, 109, 0.52);
  border-radius: 50%;
  background: rgba(9, 11, 14, 0.72);
  color: var(--pikachu-yellow);
  cursor: pointer;
  pointer-events: auto;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.carousel-arrow:hover {
  transform: scale(1.08);
  border-color: var(--pikachu-yellow);
  background: var(--pikachu-yellow);
  color: #090b0e;
}

.carousel-arrow svg {
  width: 1.2rem;
  height: 1.2rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

@media (max-width: 680px) {
  .journey-video {
    inset: 0 0 0 34%;
    width: 66%;
    object-fit: cover;
    object-position: center;
    opacity: 0.62;
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 35%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 35%);
  }

  .journey-video-overlay {
    background: linear-gradient(
      90deg,
      #090b0e 0%,
      #090b0e 34%,
      rgba(9, 11, 14, 0.8) 45%,
      rgba(9, 11, 14, 0.4) 70%,
      transparent 100%
    );
  }

  .journey-video-caption {
    display: none;
  }

  .carousel-controls {
    right: -0.25rem;
    left: -0.25rem;
  }

  .carousel-arrow {
    width: 2.1rem;
    height: 2.1rem;
  }

  .carousel-arrow svg {
    width: 1rem;
    height: 1rem;
  }
}

.journey-carousel {
  position: relative;
  display: block;
  flex: 1;
  min-height: 0;
  height: min(60svh, 540px);
  margin-bottom: 2.5rem;
  overflow: visible;
  perspective: 1000px;
  outline: none;
  touch-action: pan-y;
  cursor: grab;
}

.journey-carousel:focus-visible {
  border-radius: 1rem;
  outline: 1px solid rgba(215, 181, 109, 0.5);
  outline-offset: 0.4rem;
}

.journey-carousel.is-dragging {
  cursor: grabbing;
  user-select: none;
}

.project-card {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  width: clamp(175px, 18.5vw, 270px);
  height: min(58svh, 520px);
  flex: none;
  flex-direction: column;
  border-color: rgba(215, 181, 109, 0.28);
  border-radius: 1rem;
  background: linear-gradient(160deg, rgba(25, 27, 30, 0.96), rgba(11, 13, 16, 0.97));
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.48);
  transform-origin: center center;
  transition:
    transform 480ms cubic-bezier(0.2, 0.75, 0.25, 1),
    opacity 380ms ease,
    filter 380ms ease,
    box-shadow 380ms ease;
  cursor: pointer;
}

.project-card--center {
  z-index: 3;
  opacity: 1;
  filter: none;
  transform: translate(-50%, -50%) scale(1);
  cursor: grab;
}

.project-card--left,
.project-card--right {
  z-index: 2;
  opacity: 0.68;
  filter: saturate(0.72) brightness(0.78);
}

.project-card--left {
  transform: translate(calc(-50% - 82%), -50%) scale(0.82);
}

.project-card--right {
  transform: translate(calc(-50% + 82%), -50%) scale(0.82);
}

.project-card--left:hover,
.project-card--right:hover {
  z-index: 4;
  opacity: 0.9;
  filter: saturate(0.9) brightness(0.92);
}

.project-card--left:hover {
  transform: translate(calc(-50% - 82%), -50%) scale(0.86);
}

.project-card--right:hover {
  transform: translate(calc(-50% + 82%), -50%) scale(0.86);
}

.project-image-wrapper {
  flex: 0 0 54%;
  border: 0;
  border-bottom: 1px solid rgba(215, 181, 109, 0.18);
}

.project-image-wrapper::after {
  position: absolute;
  inset: 35% 0 0;
  content: '';
  background: linear-gradient(transparent, rgba(9, 11, 14, 0.65));
  pointer-events: none;
}

.project-counter {
  position: absolute;
  z-index: 1;
  bottom: 0.85rem;
  left: 1rem;
  margin: 0;
  color: var(--text-white);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8);
}

.project-info {
  min-height: 0;
  flex: 1;
  justify-content: flex-start;
  overflow: hidden;
  padding: 1rem 1.1rem 1.1rem;
}

.project-title {
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 0.45rem;
  font-size: clamp(1rem, 1.35vw, 1.3rem);
  line-height: 1.2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.project-description {
  display: -webkit-box;
  overflow: hidden;
  font-size: 0.76rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.project-tech {
  gap: 0.35rem;
  margin: 0.7rem 0 0.85rem;
}

.project-tech li {
  padding: 0.2rem 0.45rem;
  font-size: 0.65rem;
}

.project-card-footer {
  gap: 0.5rem;
}

.project-links {
  gap: 0.65rem;
}

.project-link {
  font-size: 0.7rem;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  transform: translateY(-50%);
  pointer-events: none;
}

.carousel-arrow {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  pointer-events: auto;
}

.carousel-pagination {
  position: absolute;
  right: 0;
  bottom: -2rem;
  left: 0;
  z-index: 5;
  justify-content: center;
  gap: 0.55rem;
  margin: 0;
}

.carousel-pagination button {
  width: 0.55rem;
  height: 0.55rem;
  flex: 0 0 auto;
  border-radius: 50%;
  transition: transform 220ms ease, background-color 220ms ease, box-shadow 220ms ease;
}

.carousel-pagination button.active {
  width: 0.55rem;
  background: var(--pikachu-yellow);
  box-shadow: 0 0 0.6rem rgba(255, 215, 0, 0.48);
  transform: scale(1.3);
}

@media (max-width: 900px) {
  .journey-carousel {
    height: min(56svh, 470px);
  }

  .project-card {
    width: clamp(170px, 25vw, 230px);
    height: min(53svh, 450px);
  }
}

@media (max-width: 680px) {
  .journey-carousel {
    height: clamp(430px, 62svh, 520px);
    margin-bottom: 2.5rem;
  }

  .project-card {
    width: clamp(175px, 56vw, 235px);
    height: min(56svh, 490px);
  }

  .project-card--left {
    transform: translate(calc(-50% - 79%), -50%) scale(0.78);
  }

  .project-card--right {
    transform: translate(calc(-50% + 79%), -50%) scale(0.78);
  }

  .project-card--left:hover {
    transform: translate(calc(-50% - 79%), -50%) scale(0.81);
  }

  .project-card--right:hover {
    transform: translate(calc(-50% + 79%), -50%) scale(0.81);
  }

  .project-image-wrapper {
    flex-basis: 50%;
  }

  .project-info {
    padding: 0.8rem;
  }

  .project-title {
    font-size: 1rem;
  }

  .project-description {
    font-size: 0.68rem;
    -webkit-line-clamp: 3;
  }

  .project-tech {
    margin: 0.55rem 0 0.7rem;
  }

  .project-links {
    flex-direction: column;
    gap: 0.3rem;
  }

  .carousel-controls {
    right: -0.25rem;
    left: -0.25rem;
  }

  .carousel-arrow {
    width: 2rem;
    height: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .carousel-pagination button {
    transition: none;
  }
}

@media (max-width: 680px) {
  .journey-section {
    align-items: stretch;
    padding: clamp(5.5rem, 12vh, 7rem) clamp(0.75rem, 4vw, 1rem) 2.5rem;
  }

  .journey-video {
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.52;
    -webkit-mask-image: none;
    mask-image: none;
  }

  .journey-video-overlay {
    background:
      linear-gradient(180deg, rgba(9, 11, 14, 0.84), rgba(9, 11, 14, 0.66) 45%, rgba(9, 11, 14, 0.88)),
      linear-gradient(90deg, rgba(9, 11, 14, 0.32), transparent 55%, rgba(9, 11, 14, 0.32));
  }

  .journey-layout {
    max-width: 34rem;
  }

  .journey-heading h2 {
    font-size: clamp(2.25rem, 11vw, 3.75rem);
  }

  .journey-kicker {
    font-size: clamp(0.62rem, 2.8vw, 0.75rem);
    letter-spacing: 0.14em;
  }

  .journey-intro {
    font-size: clamp(0.85rem, 3.8vw, 0.95rem);
  }

  .journey-carousel {
    flex: none;
    height: clamp(380px, 62svh, 500px);
  }

  .project-card {
    width: clamp(165px, 58vw, 230px);
    height: min(56svh, 470px);
  }

  .project-description {
    font-size: clamp(0.75rem, 3vw, 0.82rem);
  }

  .project-tech li {
    font-size: clamp(0.65rem, 2.7vw, 0.72rem);
  }

  .carousel-arrow {
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (max-width: 380px) {
  .journey-carousel {
    height: clamp(360px, 60svh, 440px);
  }

  .project-card {
    width: min(62vw, 210px);
    height: min(54svh, 410px);
  }

  .project-info {
    padding: 0.7rem;
  }
}

@media (max-width: 900px) and (max-height: 520px) {
  .journey-section {
    padding-block: 4.5rem 2rem;
  }

  .journey-carousel {
    height: 68svh;
    min-height: 260px;
  }

  .project-card {
    height: 62svh;
    min-height: 240px;
  }
}
</style>