<script setup lang="ts">
import { computed } from 'vue'
import { useDOMInspector } from '../../composables/useDOMInspector'
const { enabled, target, box, position, markup, breadcrumb } = useDOMInspector()
const tokens = computed(() => markup.value.split(/(<\/?[\w-]+|>|"[^"]*")/g).filter(Boolean))
</script>
<template>
  <button class="inspector-toggle mono" :aria-pressed="enabled" @click="enabled = !enabled">
    ⌘ Inspect mode <span>{{ enabled ? 'ON' : 'OFF' }}</span>
  </button>
  <Teleport to="body"
    ><Transition name="fade"
      ><div v-if="enabled && target" class="inspector-overlay" aria-hidden="true">
        <div
          class="inspect-outline"
          :style="{
            left: box.left + 'px',
            top: box.top + 'px',
            width: box.width + 'px',
            height: box.height + 'px',
          }"
        ></div>
        <div class="inspect-tooltip" :style="{ left: position.x + 'px', top: position.y + 'px' }">
          <small>{{ breadcrumb }}</small
          ><code
            ><span
              v-for="(token, i) in tokens"
              :key="i"
              :class="{
                'syntax-tag': token.startsWith('<'),
                'syntax-value': token.startsWith('&quot;'),
              }"
              >{{ token }}</span
            ></code
          >
        </div>
      </div></Transition
    ></Teleport
  >
</template>
