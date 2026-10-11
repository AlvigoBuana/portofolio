<template>
  <video
    ref="videoRef"
    class="bg-video"
    muted
    loop
    playsinline
    :preload="shouldLoad ? 'auto' : 'none'"
    :poster="poster || undefined"
    aria-hidden="true"
    tabindex="-1"
  >
    <source v-if="shouldLoad && webm" :src="webm" type="video/webm" />
    <source
      v-if="shouldLoad"
      :src="src"
      type="video/mp4"
      @error="handleSourceError"
    />
  </video>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  webm: { type: String, default: '' },
  poster: { type: String, default: '' },
  active: { type: Boolean, default: true },
})

const videoRef = ref(null)
const hasBeenNear = ref(false)
const inViewport = ref(false)
const reducedMotion = ref(false)
const lowData = ref(false)

const shouldLoad = computed(
  () => hasBeenNear.value && !reducedMotion.value && !lowData.value,
)
const canPlay = computed(
  () => props.active && inViewport.value && shouldLoad.value,
)

let loadObserver = null
let playObserver = null
let motionQuery = null

const sync = async () => {
  const video = videoRef.value
  if (!video) return

  if (canPlay.value) {
    await nextTick()
    video.play().catch((error) => {
      if (error?.name !== 'AbortError') {
        console.warn('Background video autoplay was prevented.', error)
      }
    })
  } else {
    video.pause()
  }
}

watch(canPlay, sync)
watch(shouldLoad, sync)

const handleMotionChange = () => {
  reducedMotion.value = motionQuery.matches
}

// Event error hanya muncul di <source>, bukan di <video>
const handleSourceError = (event) => {
  console.error('Background video could not be loaded.', {
    source: event.target?.src,
  })
}

onMounted(() => {
  const video = videoRef.value
  if (!video) return
  video.muted = true

  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', handleMotionChange)

  const connection = navigator.connection
  lowData.value =
    Boolean(connection?.saveData) ||
    ['slow-2g', '2g'].includes(connection?.effectiveType)

  // Mulai mengunduh satu layar sebelum terlihat, putar hanya saat terlihat
  loadObserver = new IntersectionObserver(
    (entries) => {
      if (entries[entries.length - 1].isIntersecting) hasBeenNear.value = true
    },
    { rootMargin: '100% 0px' },
  )
  playObserver = new IntersectionObserver((entries) => {
    inViewport.value = entries[entries.length - 1].isIntersecting
  })

  loadObserver.observe(video)
  playObserver.observe(video)
})

onBeforeUnmount(() => {
  loadObserver?.disconnect()
  playObserver?.disconnect()
  motionQuery?.removeEventListener('change', handleMotionChange)
})
</script>