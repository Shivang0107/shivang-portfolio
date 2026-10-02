<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '../../stores/useGameStore'
import { repairIssues, type RepairId } from '../../data/repairData'
const game = useGameStore()
let opener: HTMLElement | null = null
function jump(id?: RepairId) {
  const target =
    repairIssues.find((issue) => issue.id === id) ||
    repairIssues.find((issue) => !game.completed.includes(issue.id))
  if (!target) return
  const el = document.querySelector<HTMLElement>(target.target)
  const scrollTarget = target.id === 'heading' ? document.querySelector('#home') : el
  scrollTarget?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: target.id === 'heading' ? 'start' : 'center',
  })
  el?.focus({ preventScroll: true })
}
watch(
  () => game.status,
  async (status, old) => {
    if (status === 'playing' && old !== 'playing') {
      if (old === 'idle') opener = document.activeElement as HTMLElement
      await nextTick()
      jump('heading')
    }
    if (status === 'results') {
      await nextTick()
      document.querySelector<HTMLElement>('.repair-next')?.focus({ preventScroll: true })
    }
    if (status === 'idle') {
      await nextTick()
      const navPlay = document.querySelector<HTMLElement>('.nav-play')
      const target = opener?.offsetParent
        ? opener
        : navPlay?.offsetParent
          ? navPlay
          : document.querySelector<HTMLElement>('.menu-toggle')
      target?.focus({ preventScroll: true })
    }
  },
)
watch(
  () => game.completed.length,
  async () => {
    if (game.status !== 'playing') return
    const id = game.completed.at(-1)
    await nextTick()
    if (id) document.querySelector<HTMLElement>(`#repair-${id}`)?.focus({ preventScroll: true })
  },
)
function escape(event: KeyboardEvent) {
  if (event.key === 'Escape' && game.status !== 'idle') game.exit()
}
onMounted(() => document.addEventListener('keydown', escape))
onUnmounted(() => document.removeEventListener('keydown', escape))
</script>
<template>
  <Teleport to="body"
    ><Transition name="fade"
      ><aside v-if="game.status !== 'idle'" class="repair-hud" aria-label="Page repair controls">
        <div class="repair-hud-status">
          <span class="repair-status-dot"></span>
          <div>
            <strong>{{
              game.status === 'results' ? 'All checks passing.' : 'You broke it. Now ship the fix.'
            }}</strong>
            <p role="status">
              {{
                game.status === 'results'
                  ? 'The real portfolio is restored. Nicely debugged.'
                  : `${game.completed.length} / 4 repaired · adjust the highlighted controls on the page`
              }}
            </p>
          </div>
        </div>
        <div v-if="game.status === 'playing'" class="repair-checks" aria-label="Jump to a repair">
          <button
            v-for="(issue, i) in repairIssues"
            :key="issue.id"
            :class="{ passed: game.completed.includes(issue.id) }"
            :aria-label="`${issue.title}: ${game.completed.includes(issue.id) ? 'fixed' : 'needs repair'}`"
            @click="jump(issue.id)"
          >
            {{ game.completed.includes(issue.id) ? '✓' : '0' + (i + 1) }}
          </button>
        </div>
        <div class="repair-hud-actions">
          <button v-if="game.status === 'playing'" class="repair-next" @click="jump()">
            Next bug ↓</button
          ><button v-else class="repair-next" @click="game.open()">Break it again ↻</button
          ><button @click="game.exit()">
            {{ game.status === 'results' ? 'Done' : 'Restore & exit' }} ×
          </button>
        </div>
      </aside></Transition
    ></Teleport
  >
</template>
