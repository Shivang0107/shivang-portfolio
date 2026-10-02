import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUIStore = defineStore('ui', () => {
  const theme = ref<'light' | 'dark'>('dark')
  function apply(value: 'light' | 'dark') {
    theme.value = value
    document.documentElement.dataset.theme = value
    document.documentElement.style.colorScheme = value
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', value === 'dark' ? '#0d1421' : '#f5f8ff')
  }
  function initialize() {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    let saved: string | null = null
    try {
      saved = localStorage.getItem('portfolio-theme')
    } catch {
      /* optional storage */
    }
    let explicit = saved === 'light' || saved === 'dark'
    apply(explicit ? (saved as 'light' | 'dark') : media.matches ? 'dark' : 'light')
    const sync = () => {
      if (!explicit) apply(media.matches ? 'dark' : 'light')
    }
    const markExplicit = () => {
      explicit = true
    }
    media.addEventListener('change', sync)
    window.addEventListener('portfolio-theme-change', markExplicit)
    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener('portfolio-theme-change', markExplicit)
    }
  }
  function toggleTheme() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
    window.dispatchEvent(new Event('portfolio-theme-change'))
    try {
      localStorage.setItem('portfolio-theme', theme.value)
    } catch {
      /* optional storage */
    }
  }
  return { theme, initialize, toggleTheme }
})
