import { onMounted, onUnmounted, ref } from 'vue'
export function useScrollProgress() {
  const progress = ref(0)
  let observer: ResizeObserver | undefined
  function update() {
    const distance = document.documentElement.scrollHeight - window.innerHeight
    progress.value = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0
  }
  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    observer = new ResizeObserver(update)
    observer.observe(document.body)
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    observer?.disconnect()
  })
  return progress
}
