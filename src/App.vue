<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AppNavbar from './components/layout/AppNavbar.vue'
import HeroSection from './components/hero/HeroSection.vue'
import Cursor404 from './components/character/Cursor404.vue'
import ExperienceTimeline from './components/experience/ExperienceTimeline.vue'
import ProjectShowcase from './components/projects/ProjectShowcase.vue'
import TechnologyConstellation from './components/skills/TechnologyConstellation.vue'
import WorkflowSection from './components/WorkflowSection.vue'
import ContactSection from './components/contact/ContactSection.vue'
import { capabilities, profile } from './data/resume'
import { useScrollProgress } from './composables/useScrollProgress'
import { useUIStore } from './stores/useUIStore'
import { useGameStore } from './stores/useGameStore'
import PageRepairGame from './components/game/PageRepairGame.vue'
import RepairStation from './components/game/RepairStation.vue'
const ui = useUIStore()
let cleanTheme: (() => void) | undefined
const game = useGameStore(),
  reduced = usePreferredReducedMotion(),
  progress = useScrollProgress(),
  egg = ref(false)
const displayedCapabilities = computed(() => {
  const items = capabilities.map((capability, index) => ({ capability, index }))
  if (!game.isBroken('capabilities')) return items
  if (game.capabilityOrder === 'reverse') return [...items].reverse()
  if (game.capabilityOrder === 'mixed') return [items[2]!, items[0]!, items[3]!, items[1]!]
  return items
})
let context: gsap.Context | undefined, media: gsap.MatchMedia | undefined
onMounted(() => {
  cleanTheme = ui.initialize()
  gsap.registerPlugin(ScrollTrigger)
  media = gsap.matchMedia()
  context = gsap.context(() => {
    media?.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils
        .toArray<HTMLElement>('.section-heading, .capability-card, .timeline, .project, .workflow')
        .forEach((el) =>
          gsap.from(el, {
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 94%', once: true },
          }),
        )
      gsap.to('.timeline', {
        '--line-progress': '100%',
        ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 75%', end: 'bottom 60%', scrub: true },
      })
    })
  })
})
onUnmounted(() => {
  cleanTheme?.()
  media?.revert()
  context?.revert()
})
</script>
<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="scroll-progress" :style="{ transform: `scaleX(${progress})` }"></div>
  <AppNavbar />
  <main id="main" :class="{ 'page-repair-active': game.status !== 'idle' }">
    <HeroSection />
    <div class="marquee-band mono" aria-hidden="true">
      <span>INTERFACES + APIs</span><b>✳</b><span>PERFORMANCE ENGINEERING</span><b>✳</b
      ><span>PRODUCTION SYSTEMS</span><b>✳</b>
    </div>
    <section id="about" class="section-shell section-space">
      <div class="section-label">
        <span>01 / A LITTLE CONTEXT</span><span>THE ENGINEER BEHIND THE CODE</span>
      </div>
      <div class="about-grid">
        <h2>From the browser<br />to the <em>backend.</em></h2>
        <div>
          <p class="about-lead">
            Interfaces, APIs, data, and delivery. I connect the parts that make an application work.
          </p>
          <p>{{ profile.bio }}</p>
          <a href="#experience" class="text-link">MORE ABOUT MY JOURNEY ↘</a>
        </div>
      </div>
      <RepairStation issue="capabilities" />
      <div
        class="capability-grid"
        :class="{ 'capabilities-broken': game.isBroken('capabilities') }"
      >
        <article
          v-for="{ capability: [title, stack, description], index } in displayedCapabilities"
          :key="title"
          class="capability-card"
        >
          <span class="capability-index mono">0{{ index + 1 }} / {{ title }}</span>
          <h3>{{ stack }}</h3>
          <p>{{ description }}</p>
        </article>
      </div>
    </section>
    <ExperienceTimeline /><ProjectShowcase /><TechnologyConstellation /><WorkflowSection />
    <section id="play" class="play-section section-shell">
      <div class="play-copy">
        <span class="eyebrow">05 / THE DEBUG LAB</span>
        <h2>Find the issue.<br /><em>Ship the fix.</em></h2>
        <p>
          This entire portfolio is the playground.<br />Scramble the real page, then fix four
          frontend regressions in place.
        </p>
        <button class="button primary" @click="game.open()">BREAK THIS PAGE <span>↗</span></button
        ><small class="mono">INTERACTIVE DEMO · LAYOUT / TOKENS / RESPONSIVENESS</small>
      </div>
      <div class="page-game-preview" aria-hidden="true">
        <span class="mono">REGRESSION CHECKLIST</span>
        <div><b>01</b> Heading baseline <span>FAIL</span></div>
        <div><b>02</b> Code panel transform <span>FAIL</span></div>
        <div><b>03</b> Stack ordering <span>FAIL</span></div>
        <div><b>04</b> Project layout <span>FAIL</span></div>
        <p>No popup. The bugs are right here, on this page.</p>
      </div>
      <div class="play-character"><Cursor404 /></div>
    </section>

    <section class="section-shell education">
      <span class="eyebrow">THE FOUNDATION</span>
      <div>
        <h3>{{ profile.education.degree }}</h3>
        <p>{{ profile.education.institution }} · {{ profile.education.location }}</p>
      </div>
      <span class="mono">{{ profile.education.duration }}</span>
    </section>
    <ContactSection />
  </main>
  <footer class="footer section-shell">
    <span>© {{ new Date().getFullYear() }} {{ profile.name }}</span
    ><button :aria-pressed="egg" @click="egg = !egg">
      {{ egg ? '404: boredom not found. ↖' : 'Vue 3 · TypeScript · Vite' }}</button
    ><a href="#home">BACK TO TOP ↑</a>
  </footer>
  <PageRepairGame /><span v-if="reduced === 'reduce'" class="sr-only">Reduced motion enabled.</span>
</template>
