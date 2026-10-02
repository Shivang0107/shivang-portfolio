<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-vue-next'
import { useGameStore } from '../../stores/useGameStore'
import { useUIStore } from '../../stores/useUIStore'
import { profile } from '../../data/resume'
const ui = useUIStore()
const game = useGameStore(),
  expanded = ref(false),
  active = ref('home')
const links = ['Home', 'About', 'Experience', 'Work', 'Skills', 'Contact']
let observer: IntersectionObserver | undefined
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) active.value = entry.target.id
    },
    { rootMargin: '-15% 0px -55% 0px' },
  )
  document.querySelectorAll('main > section[id]').forEach((el) => observer?.observe(el))
})
onUnmounted(() => observer?.disconnect())
function openGame() {
  game.open()
  expanded.value = false
}
</script>
<template>
  <header class="navbar">
    <a class="wordmark" href="#home" aria-label="Shivang Sharma home">s<span>s</span><i>®</i></a
    ><button
      class="theme-toggle"
      :aria-label="ui.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="ui.toggleTheme()"
    >
      <Sun v-if="ui.theme === 'dark'" :size="17" /><Moon v-else :size="17" /><span>{{
        ui.theme === 'dark' ? 'Light' : 'Dark'
      }}</span></button
    ><button
      class="menu-toggle"
      :aria-expanded="expanded"
      aria-controls="main-navigation"
      :aria-label="expanded ? 'Close menu' : 'Open menu'"
      @click="expanded = !expanded"
    >
      <X v-if="expanded" /><Menu v-else />
    </button>
    <nav
      id="main-navigation"
      :class="{ expanded }"
      aria-label="Main navigation"
      @keydown.esc="expanded = false"
    >
      <a
        data-inspect
        v-for="link in links"
        :key="link"
        :href="'#' + link.toLowerCase()"
        :aria-current="active === link.toLowerCase() ? 'location' : undefined"
        @click="expanded = false"
        >{{ link }}</a
      ><button class="nav-play" @click="openGame()"><span>▶</span> Debug lab</button
      ><a v-if="profile.resume" :href="profile.resume" target="_blank" rel="noopener"
        >Resume <ArrowUpRight :size="14" /></a
      ><span v-else class="unavailable" title="Resume download will be added soon"
        >Resume <span class="mono">SOON</span></span
      >
    </nav>
  </header>
</template>
