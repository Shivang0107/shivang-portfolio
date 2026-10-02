<script setup lang="ts">
import { computed, ref, defineAsyncComponent, watch } from 'vue'
import { useGameStore } from '../../stores/useGameStore'
import RepairStation from '../game/RepairStation.vue'
const game = useGameStore()
const hero = ref<HTMLElement | null>(null)
const gravityActive = ref(false)
const GravityMode = defineAsyncComponent(() => import('./GravityMode.vue'))
watch(
  () => game.status,
  (status) => {
    if (status === 'playing') gravityActive.value = false
  },
)
import DOMInspector from './DOMInspector.vue'
const tab = ref('profile.ts')
const files: Record<string, string> = {
  'profile.ts': `const engineer = {
  name: "Shivang Sharma",
  role: "Software Engineer",
  company: "WebMD",
  location: "Mumbai, India",
  focus: ["Full-stack", "APIs", "Interfaces"]
};`,
  'stack.json': `{
  "frontend": ["Vue 3", "Nuxt 3", "TypeScript"],
  "build": ["Vite", "Tailwind CSS"],
  "backend": ["Java / Spring Boot", "FastAPI"],
  "workflow": ["Claude Code", "MCP"]
}`,
  'systems.md': `# Across the application stack

Interfaces: Vue / Nuxt / React
Services: Java / Spring Boot / FastAPI
Data: SQL / SOLR
Delivery: Docker / CI/CD

High-traffic platforms. End-to-end thinking.`,
}
const lines = computed(() => files[tab.value]!.split('\n'))
</script>
<template>
  <section
    ref="hero"
    id="home"
    class="hero section-shell developer-hero"
    :class="{ 'gravity-active': gravityActive }"
  >
    <div class="hero-top mono">
      <span><i class="status-dot"></i> FULL-STACK ENGINEER / MUMBAI</span>
      <div class="hero-tools">
        <GravityMode v-model="gravityActive" :root="hero" @started="game.exit()" /><DOMInspector />
      </div>
    </div>
    <div class="developer-hero-grid">
      <div class="developer-intro">
        <p class="eyebrow">// CLIENT. SERVER. EVERYTHING BETWEEN.</p>
        <h1
          aria-label="Shivang Sharma"
          :class="{ 'heading-broken': game.isBroken('heading') }"
          :style="{ '--heading-offset': game.isBroken('heading') ? game.headingOffset : 0 }"
        >
          <span data-inspect data-gravity class="identity"
            ><span
              v-for="(letter, i) in 'SHIVANG'"
              :key="i"
              class="heading-letter"
              aria-hidden="true"
              :style="{ '--jitter': [1, -0.65, 0.8, -0.4, 0.6, -0.9, 0.3][i] }"
              >{{ letter }}</span
            ></span
          ><span data-inspect data-gravity class="identity"
            ><span
              v-for="(letter, i) in 'SHARMA'"
              :key="i"
              class="heading-letter"
              aria-hidden="true"
              :style="{ '--jitter': [-0.6, 0.8, -0.9, 0.4, -0.7, 1][i] }"
              >{{ letter }}</span
            ><span class="accent">.</span></span
          >
        </h1>
        <h2>
          <span data-gravity>Interfaces.</span> <span data-gravity>APIs.</span><br /><span
            data-gravity
            class="accent"
            >Connected systems.</span
          >
        </h2>
        <p class="developer-summary">
          I build across the stack: Vue and Nuxt interfaces, Java and Python services, SQL data
          layers, and delivery workflows. Currently at <strong>WebMD</strong>, building for
          <strong>high-traffic digital platforms.</strong>
        </p>
        <RepairStation issue="heading" />
        <div class="hero-actions">
          <a data-inspect href="#work" class="button primary"
            >EXPLORE MY WORK <span>&#8599;</span></a
          ><a href="#contact" class="text-link">LET’S CONNECT &#8599;</a>
        </div>
        <div class="hero-stack mono">
          <span data-gravity>Vue / Nuxt</span><span data-gravity>Spring Boot</span
          ><span data-gravity>FastAPI</span><span data-gravity>SQL</span
          ><span data-gravity>Docker</span>
        </div>
      </div>
      <div class="profile-editor">
        <RepairStation issue="editor" />
        <div class="editor-title mono"><span>~/shivang/portfolio</span><span>READ ONLY</span></div>
        <div class="editor-tabs" aria-label="Profile files">
          <button
            v-for="(_, file) in files"
            :key="file"
            :aria-pressed="tab === file"
            :class="{ active: tab === file }"
            @click="tab = file"
          >
            {{ file }}
          </button>
        </div>
        <div
          class="editor-code"
          aria-live="polite"
          :class="{ 'editor-broken': game.isBroken('editor') }"
          :style="{
            '--editor-rotation': game.isBroken('editor') ? game.editorRotation + 'deg' : '0deg',
          }"
        >
          <div v-for="(line, i) in lines" :key="i">
            <span class="line-number" aria-hidden="true">{{ i + 1 }}</span
            ><code>{{ line || ' ' }}</code>
          </div>
        </div>
        <div class="editor-status mono">
          <span>main</span><span>Vue + TypeScript</span><span>UTF-8</span>
        </div>
      </div>
    </div>
    <div class="hero-footer mono">
      <span>SCROLL TO EXPLORE &#8595;</span><span>INSPECT THE UI. EXPLORE THE ENGINEERING.</span>
    </div>
  </section>
</template>
