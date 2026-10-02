<script setup lang="ts">
import { ref } from 'vue'
import { workflow } from '../data/resume'
const active = ref(2)
</script>
<template>
  <section class="section-shell section-space workflow-section">
    <div class="section-label">
      <span>AUTOMATION / ENGINEERING WORKFLOW</span><span>LESS REPETITION. MORE CREATION.</span>
    </div>
    <div class="section-heading">
      <h2>Automate the work.<br /><em>Keep the judgment.</em></h2>
      <p>
        Claude Code skills at WebMD.<br />Connecting feature implementation and code review<br />through
        YouTrack MCP and GitLab MCP.
      </p>
    </div>
    <div class="workflow">
      <template v-for="(stage, i) in workflow" :key="stage[0]"
        ><button :class="{ active: active === i }" :aria-pressed="active === i" @click="active = i">
          <small class="mono">0{{ i + 1 }}</small
          ><span>{{ stage[0] }}</span></button
        ><span v-if="i < workflow.length - 1" class="flow-arrow" aria-hidden="true"
          >→</span
        ></template
      >
    </div>
    <div class="workflow-description" aria-live="polite">
      <span class="accent">↳</span> {{ workflow[active]?.[1] }}
    </div>
  </section>
</template>
