export const scrollToSection = (id) => {
  const key = String(id).replace(/^#/, '')
  const section = document.getElementById(key === 'portofolio' ? 'journey' : key)
  if (!section) return null

  // #home dan #about itu sticky, jadi yang dituju track pembungkusnya
  const target = section.closest('.home-scroll-track, .about-track') ?? section
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY)

  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'instant'
    : 'smooth'

  window.dispatchEvent(new Event('portfolio:navigate'))
  window.scrollTo({ top, behavior })
  return top
}