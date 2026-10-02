<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../../stores/useGameStore'
import { repairIssues, type RepairId } from '../../data/repairData'
const props = defineProps<{ issue: RepairId }>()
const game = useGameStore()
const info = computed(() => repairIssues.find((item) => item.id === props.issue)!)
</script>
<template>
  <div
    v-if="game.status === 'playing'"
    :id="`repair-${issue}`"
    class="repair-station"
    :class="{ resolved: game.completed.includes(issue) }"
    tabindex="-1"
    :aria-label="info.title + ' repair'"
  >
    <template v-if="game.completed.includes(issue)"
      ><span class="repair-tag">PASS</span><strong>{{ info.title }} restored.</strong></template
    >
    <template v-else>
      <div class="repair-station-heading">
        <span class="repair-tag"
          >BUG {{ repairIssues.findIndex((item) => item.id === issue) + 1 }} / 4</span
        ><strong>{{ info.title }}</strong>
      </div>
      <p>{{ info.detail }}</p>
      <div class="repair-inputs">
        <label v-if="issue === 'heading'"
          >Baseline offset <output>{{ game.headingOffset }}px</output
          ><input
            v-model.number="game.headingOffset"
            type="range"
            min="0"
            max="24"
            step="1"
            aria-label="Heading baseline offset"
        /></label>
        <label v-else-if="issue === 'editor'"
          >Rotation <output>{{ game.editorRotation }}°</output
          ><input
            v-model.number="game.editorRotation"
            type="range"
            min="-8"
            max="8"
            step="1"
            aria-label="Code panel rotation"
        /></label>
        <fieldset v-else-if="issue === 'capabilities'">
          <legend>Render sequence</legend>
          <button
            v-for="order in ['reverse', 'source', 'mixed']"
            :key="order"
            :aria-pressed="game.capabilityOrder === order"
            @click="game.capabilityOrder = order"
          >
            {{ { reverse: '04 → 01', source: '01 → 04', mixed: 'Mixed' }[order] }}
          </button>
        </fieldset>
        <fieldset v-else>
          <legend>Layout strategy</legend>
          <button
            v-for="layout in ['absolute', 'grid', 'stack']"
            :key="layout"
            :aria-pressed="game.projectLayout === layout"
            @click="game.projectLayout = layout"
          >
            {{ layout }}
          </button>
        </fieldset>
        <button class="repair-apply" @click="game.repair(issue)">Apply fix ↵</button>
      </div>
      <p v-if="game.feedback[issue]" class="repair-feedback" role="status">
        {{ game.feedback[issue] }}
      </p>
    </template>
  </div>
</template>
