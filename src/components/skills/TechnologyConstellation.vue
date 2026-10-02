<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { techGroups, techDescriptions } from '../../data/resume'
const category = ref<keyof typeof techGroups>('Backend'),
  selected = ref('Java'),
  list = ref(false),
  offsets = reactive<Record<string, { x: number; y: number }>>({})
const technologies = computed(() => techGroups[category.value])
let drag: { name: string; x: number; y: number; ox: number; oy: number } | null = null
function down(event: PointerEvent, name: string) {
  if (event.button !== 0) return
  const el = event.currentTarget as HTMLElement
  el.setPointerCapture(event.pointerId)
  const offset = offsets[name] || { x: 0, y: 0 }
  drag = { name, x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }
}
function move(event: PointerEvent) {
  if (!drag) return
  const el = event.currentTarget as HTMLElement,
    parent = el.parentElement!
  const baseLeft = el.offsetLeft,
    baseTop = el.offsetTop
  offsets[drag.name] = {
    x: Math.max(
      -baseLeft,
      Math.min(parent.clientWidth - baseLeft - el.offsetWidth, drag.ox + event.clientX - drag.x),
    ),
    y: Math.max(
      -baseTop,
      Math.min(parent.clientHeight - baseTop - el.offsetHeight, drag.oy + event.clientY - drag.y),
    ),
  }
}
function up(event: PointerEvent) {
  drag = null
  const el = event.currentTarget as HTMLElement
  if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
}
function position(index: number, name: string) {
  const offset = offsets[name] || { x: 0, y: 0 }
  return {
    left: `${7 + (index % 3) * 31}%`,
    top: `${12 + Math.floor(index / 3) * 22}%`,
    transform: `translate(${offset.x}px, ${offset.y}px)`,
  }
}
function selectCategory(group: keyof typeof techGroups) {
  category.value = group
  selected.value = techGroups[group][0]!
}
</script>
<template>
  <section id="skills" class="section-shell section-space">
    <div class="section-label">
      <span>04 / MY TOOLKIT</span><span>THE RIGHT TOOL FOR THE RIGHT IDEA</span>
    </div>
    <div class="section-heading">
      <h2>My engineering<br /><em>toolkit.</em></h2>
      <p>A stack built through doing.<br />Select a node. Follow a connection.</p>
    </div>
    <div class="tech-tabs">
      <button
        v-for="(_, group) in techGroups"
        :key="group"
        :aria-pressed="category === group"
        :class="{ active: category === group }"
        @click="selectCategory(group)"
      >
        {{ group }}</button
      ><button class="list-toggle" :aria-pressed="list" @click="list = !list">
        {{ list ? '⊙ Constellation' : '☷ List view' }}
      </button>
    </div>
    <div class="tech-workspace">
      <div class="constellation" :class="{ 'tech-list': list }">
        <svg
          v-if="!list"
          class="connections"
          viewBox="0 0 800 450"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M120 75L380 75 650 75 650 170 380 170 120 170 120 270 380 270 650 270 650 370 380 370 120 370M380 75V370M120 75L650 370M650 75L120 370"
          /></svg
        ><button
          v-for="(tech, i) in technologies"
          :key="tech"
          class="tech-node"
          :class="{ selected: selected === tech }"
          :style="list ? {} : position(i, tech)"
          :aria-pressed="selected === tech"
          @pointerdown="!list && down($event, tech)"
          @pointermove="move"
          @pointerup="up"
          @pointercancel="up"
          @lostpointercapture="drag = null"
          @click="selected = tech"
        >
          {{ tech }}</button
        ><span v-if="!list" class="constellation-hint mono"
          >DRAG TO REARRANGE · SELECT TO EXPLORE</span
        >
      </div>
      <aside class="tech-detail" aria-live="polite">
        <span class="eyebrow">{{ category }}</span
        ><span class="tech-symbol" aria-hidden="true">✳</span>
        <h3>{{ selected }}</h3>
        <p>
          {{
            techDescriptions[selected] ||
            `${selected} is part of my ${category.toLowerCase()} toolkit. A specific project association is not listed in my resume.`
          }}
        </p>
        <span class="mono">ALWAYS A WORK IN PROGRESS ↗</span>
      </aside>
    </div>
  </section>
</template>
