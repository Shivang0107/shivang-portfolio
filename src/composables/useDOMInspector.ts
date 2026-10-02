import { ref, onMounted, onUnmounted } from 'vue'
export function useDOMInspector() {
  const enabled = ref(true),
    target = ref<HTMLElement | null>(null),
    box = ref({ left: 0, top: 0, width: 0, height: 0 }),
    position = ref({ x: 0, y: 0 }),
    markup = ref(''),
    breadcrumb = ref('')
  function inspect(event: Event) {
    if (!enabled.value) return
    const el = (event.target as Element)?.closest<HTMLElement>('[data-inspect]')
    if (!el) {
      target.value = null
      return
    }
    const rect = el.getBoundingClientRect()
    box.value = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    const pointer = event as PointerEvent
    position.value = {
      x: Math.max(
        12,
        Math.min(
          pointer.clientX || rect.left,
          window.innerWidth - Math.min(360, window.innerWidth - 24) - 12,
        ),
      ),
      y: Math.max(12, Math.min((pointer.clientY || rect.bottom) + 24, window.innerHeight - 150)),
    }
    markup.value = el.outerHTML.replace(/\sdata-inspect="[^"]*"/g, '')
    breadcrumb.value = `body › ${el.parentElement?.tagName.toLowerCase()} › ${el.tagName.toLowerCase()}`
    target.value = el
  }
  function clear() {
    target.value = null
  }
  onMounted(() => {
    document.addEventListener('pointermove', inspect)
    document.addEventListener('pointerdown', inspect)
    document.addEventListener('focusin', inspect)
    window.addEventListener('scroll', clear, { passive: true })
  })
  onUnmounted(() => {
    document.removeEventListener('pointermove', inspect)
    document.removeEventListener('pointerdown', inspect)
    document.removeEventListener('focusin', inspect)
    window.removeEventListener('scroll', clear)
  })
  return { enabled, target, box, position, markup, breadcrumb }
}
