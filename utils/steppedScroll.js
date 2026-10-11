const GESTURE_IDLE_MS = 180
const NAV_START_GRACE_MS = 400
const NAV_IDLE_MS = 150
const EPSILON = 2
const HOLD_ZONE = 0.3 // tinggi viewport di bawah stop terakhir tempat "magnet" aktif
const IGNORE_SELECTOR =
  'input, textarea, select, [contenteditable="true"], [data-no-step-scroll]'

const registry = new Map()
let teardown = null

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const getAllStops = () => {
  const merged = []
  registry.forEach((getStops) => merged.push(...getStops()))
  merged.sort((a, b) => a - b)
  return merged.filter(
    (stop, index) => index === 0 || stop - merged[index - 1] > EPSILON,
  )
}

const startController = () => {
  let gestureActive = false
  let animationActive = false
  let navigating = false
  let gestureTimer = 0
  let navTimer = 0
  let animationTimer = 0
  let animationFrame = 0
  let lastScrollY = window.scrollY

  const armGestureTimer = () => {
    window.clearTimeout(gestureTimer)
    gestureTimer = window.setTimeout(() => {
      gestureActive = false
    }, GESTURE_IDLE_MS)
  }

  const armNavTimer = (delay) => {
    window.clearTimeout(navTimer)
    navTimer = window.setTimeout(() => {
      navigating = false
    }, delay)
  }

  const stopAnimation = () => {
    animationActive = false
    window.clearTimeout(animationTimer)
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }
  }

  const animateTo = (target) => {
    animationActive = true

    if (prefersReducedMotion()) {
      window.scrollTo({ top: target, behavior: 'instant' })
      stopAnimation()
      return
    }

    const from = window.scrollY
    const distance = target - from
    const duration = Math.min(750, Math.max(600, Math.abs(distance) * 0.45))
    const startedAt = performance.now()

    const step = (timestamp) => {
      const progress = Math.min(Math.max((timestamp - startedAt) / duration, 0), 1)
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

      window.scrollTo({
        top: progress === 1 ? target : from + distance * eased,
        behavior: 'instant',
      })

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      } else {
        animationFrame = 0
        stopAnimation()
      }
    }

    animationFrame = requestAnimationFrame(step)
    animationTimer = window.setTimeout(() => {
      window.scrollTo({ top: target, behavior: 'instant' })
      stopAnimation()
    }, duration + 150)
  }

  const handleWheel = (event) => {
    if (navigating || event.ctrlKey || event.deltaY === 0) return
    if (event.target instanceof Element && event.target.closest(IGNORE_SELECTOR)) return

    const stops = getAllStops()
    if (stops.length < 2) return

    const y = window.scrollY
    const first = stops[0]
    const last = stops[stops.length - 1]
    const forward = event.deltaY > 0
    const belowLast = y > last + EPSILON
    // Magnet: scroll naik dari zona bebas, sudah dekat stop terakhir (journey)
    const inHoldZone =
      !forward && belowLast && y - last <= window.innerHeight * HOLD_ZONE

    if (y < first - EPSILON) return
    if (belowLast && !inHoldZone) return
    if (forward && y >= last - EPSILON) return
    if (!forward && y <= first + EPSILON) return

    event.preventDefault()
    armGestureTimer()
    if (gestureActive || animationActive) return
    gestureActive = true

    const target = forward
      ? stops.find((stop) => stop > y + EPSILON)
      : [...stops].reverse().find((stop) => stop < y - EPSILON)

    if (target === undefined) return
    animateTo(target)
  }

  // Pengaman: scroll naik yang melewati stop terakhir terlalu cepat
  const handleScroll = () => {
    const previous = lastScrollY
    const current = window.scrollY
    lastScrollY = current

    if (navigating) {
      armNavTimer(NAV_IDLE_MS)
      return
    }
    if (animationActive) return

    const stops = getAllStops()
    if (stops.length < 2) return
    const lastStop = stops[stops.length - 1]

    if (previous > lastStop + EPSILON && current < lastStop - EPSILON) {
      window.scrollTo({ top: lastStop, behavior: 'instant' })
      lastScrollY = lastStop
      gestureActive = true // tahan sisa inersia sampai user berhenti scroll
      armGestureTimer()
    }
  }

  const handleNavigate = () => {
    stopAnimation()
    gestureActive = false
    window.clearTimeout(gestureTimer)
    navigating = true
    armNavTimer(NAV_START_GRACE_MS)
  }

  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('portfolio:navigate', handleNavigate)

  return () => {
    window.removeEventListener('wheel', handleWheel)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('portfolio:navigate', handleNavigate)
    window.clearTimeout(gestureTimer)
    window.clearTimeout(navTimer)
    stopAnimation()
  }
}

export const registerScrollStops = (id, getStops) => {
  registry.set(id, getStops)
  if (!teardown) teardown = startController()

  return () => {
    if (registry.get(id) === getStops) registry.delete(id)
    if (registry.size === 0 && teardown) {
      teardown()
      teardown = null
    }
  }
}