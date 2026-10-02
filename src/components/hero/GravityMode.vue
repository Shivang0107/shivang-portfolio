<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useGravity } from '../../composables/useGravity'
const props = defineProps<{ root: HTMLElement | null }>()
const active = defineModel<boolean>({ default: false })
const emit = defineEmits<{ started: [] }>()
const loading = ref(false),
  error = ref(''),
  trigger = ref<HTMLButtonElement>()
const physics = useGravity()
const shaking = ref(false)
async function toggle() {
  if (active.value) {
    reset()
    return
  }
  if (!props.root || loading.value) return
  loading.value = true
  error.value = ''
  try {
    emit('started')
    const ready = await physics.start(props.root)
    active.value = ready
  } catch {
    physics.stop()
    error.value = 'Gravity could not start. Please try again.'
  } finally {
    loading.value = false
  }
}
function reset() {
  shaking.value = false
  active.value = false
  physics.stop()
  trigger.value?.focus({ preventScroll: true })
}
function shake() {
  physics.shake()
  shaking.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
watch(active, (value) => {
  if (!value) physics.stop()
})
watch(physics.running, (value) => {
  if (!value) active.value = false
})
function escape(event: KeyboardEvent) {
  if (event.key === 'Escape' && (active.value || loading.value)) reset()
}
function keyboard(event: KeyboardEvent) {
  if (event.target instanceof HTMLSelectElement) return
  if (event.key.startsWith('Arrow')) {
    event.preventDefault()
    physics.nudge(event.key)
  }
}
onMounted(() => window.addEventListener('keydown', escape))
onUnmounted(() => window.removeEventListener('keydown', escape))
</script>
<template>
  <div class="gravity-toggle-wrap">
    <button
      ref="trigger"
      class="gravity-toggle mono"
      :aria-pressed="active"
      :disabled="loading"
      @click="toggle"
    >
      GRAVITY: {{ loading ? 'LOADING' : active ? 'ON' : 'OFF' }}
      <span aria-hidden="true">↓</span></button
    ><span v-if="error" role="status" class="gravity-error">{{ error }}</span>
  </div>
  <Teleport to="body">
    <div
      v-if="active"
      class="gravity-layer"
      :class="{ shaking }"
      aria-hidden="true"
      @animationend.self="shaking = false"
    >
      <div
        v-for="word in physics.words.value"
        :key="word.id"
        class="gravity-word"
        :class="{ chip: word.chip, selected: physics.selected.value === word.id }"
        :data-word="word.id"
        :style="{
          width: word.width + 'px',
          height: word.height + 'px',
          fontSize: word.fontSize,
          fontFamily: word.fontFamily,
          fontWeight: word.fontWeight,
          letterSpacing: word.letterSpacing,
          transform: `translate(${word.x - word.width / 2}px, ${word.y - word.height / 2}px) rotate(${word.angle}rad)`,
        }"
        @pointerdown="physics.grab($event, word.id)"
        @pointermove="physics.move"
        @pointerup="physics.release"
        @pointercancel="physics.release"
        @lostpointercapture="physics.release"
      >
        {{ word.label }}
      </div>
      <div class="gravity-floor"></div>
    </div>
    <aside v-if="active" class="gravity-controls" aria-label="Gravity controls" @keydown="keyboard">
      <div>
        <strong>Physics has entered the chat.</strong>
        <p>Grab a word. Throw it. Build a stack.</p>
      </div>
      <label
        ><span class="sr-only">Select a gravity word</span
        ><select v-model.number="physics.selected.value" aria-label="Select a gravity word">
          <option v-for="word in physics.words.value" :key="word.id" :value="word.id">
            {{ word.label }}
          </option>
        </select></label
      ><button
        @click="physics.toss()"
        title="Arrow keys move the selected word when a button is focused"
      >
        Toss word ↗</button
      ><button @click="shake">Shake ↔</button
      ><button class="gravity-reset" @click="reset">Reset everything ↺</button
      ><span class="sr-only"
        >Use the selector and Toss word button, or focus a button and use arrow keys to move the
        selected word. Escape resets everything.</span
      >
    </aside>
  </Teleport>
</template>
