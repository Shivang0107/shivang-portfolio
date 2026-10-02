<script setup lang="ts">
import { ref } from 'vue'
import { experience } from '../../data/resume'
const selected = ref(0)
</script>
<template>
  <section id="experience" class="section-shell section-space">
    <div class="section-label">
      <span>02 / THE JOURNEY</span><span>ALWAYS BUILDING. ALWAYS LEARNING.</span>
    </div>
    <div class="section-heading">
      <h2>Production code.<br /><em>Across the stack.</em></h2>
      <p>From end-to-end applications to<br />high-traffic digital platforms.</p>
    </div>
    <div class="timeline">
      <article v-for="(item, i) in experience" :key="item.name" :class="{ active: selected === i }">
        <button
          class="timeline-trigger"
          :aria-expanded="selected === i"
          :aria-controls="'experience-' + i"
          @click="selected = selected === i ? -1 : i"
        >
          <span class="timeline-dot"></span><span class="mono timeline-date">{{ item.date }}</span
          ><span class="timeline-name"
            >{{ item.name }}<small>{{ item.role }} · {{ item.location }}</small></span
          ><span class="expand-icon">{{ selected === i ? '−' : '+' }}</span></button
        ><Transition name="expand"
          ><div v-if="selected === i" :id="'experience-' + i" class="timeline-detail">
            <ul>
              <li v-for="point in item.points" :key="point">{{ point }}</li>
            </ul>
            <div v-if="i === 0" class="migration-path mono">
              <span>VUE 2</span><i>→</i><span>VUE 3</span><i>→</i><b>VITE ↗</b
              ><small>Modern build pipeline</small>
            </div>
          </div></Transition
        >
      </article>
    </div>
  </section>
</template>
