import { ref } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
export function usePointerTracking() {
  const eyes = ref({ x: 0, y: 0 }),
    reduced = usePreferredReducedMotion()
  function track(event: PointerEvent) {
    if (reduced.value === 'reduce') return
    const r = (event.currentTarget as HTMLElement).getBoundingClientRect()
    eyes.value = {
      x: Math.max(-3, Math.min(3, (event.clientX - r.left - r.width / 2) / 12)),
      y: Math.max(-3, Math.min(3, (event.clientY - r.top - r.height / 2) / 12)),
    }
  }
  return { eyes, track }
}
