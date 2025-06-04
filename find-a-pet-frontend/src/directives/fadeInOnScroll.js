export default {
  mounted(el) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )

    el.classList.add('before-visible')
    observer.observe(el)
  }
}
