<script setup lang="ts">
import { ref } from 'vue'
import { usePointerTracking } from '../../composables/usePointerTracking'
import { useGameStore } from '../../stores/useGameStore'
const { eyes, track } = usePointerTracking(),
  game = useGameStore(),
  expanded = ref(false)
function inviteToPlay() {
  game.open()
  expanded.value = false
}
</script>
<template>
  <div class="character" @pointermove="track">
    <button class="cursor-button" aria-label="Meet 404, the escaped cursor" :aria-expanded="expanded"
      @click="expanded = !expanded">
      <svg viewBox="0 0 100 110" aria-hidden="true">
        <path d="M16 8 L86 66 L55 70 L44 99 Z" fill="currentColor" stroke="#101010" stroke-width="3" />
        <g class="eyes" :style="{ transform: `translate(${eyes.x}px, ${eyes.y}px)` }">
          <ellipse cx="37" cy="48" rx="5" ry="8" fill="#101010" />
          <ellipse cx="54" cy="52" rx="5" ry="8" fill="#101010" />
        </g>
      </svg><span class="mono">404</span>
    </button>
    <Transition name="fade">
      <div v-if="expanded" class="character-bubble">
        Oops. My website broke. Can you fix it?<button class="text-link" @click="inviteToPlay()">
          LET’S PLAY ↗
        </button>
      </div>
    </Transition>
  </div>
</template>
