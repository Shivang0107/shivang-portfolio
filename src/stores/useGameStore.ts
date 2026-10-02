import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { repairIssues, type RepairId } from '../data/repairData'

export const useGameStore = defineStore('game', () => {
  const status = ref<'idle' | 'playing' | 'results'>('idle')
  const completed = ref<RepairId[]>([])
  const headingOffset = ref(18)
  const editorRotation = ref(-6)
  const capabilityOrder = ref('reverse')
  const projectLayout = ref('absolute')
  const feedback = ref<Partial<Record<RepairId, string>>>({})
  const progress = computed(() => completed.value.length / repairIssues.length)
  function isBroken(id: RepairId) {
    return status.value === 'playing' && !completed.value.includes(id)
  }
  function open() {
    if (status.value === 'playing') return
    completed.value = []
    feedback.value = {}
    headingOffset.value = 18
    editorRotation.value = -6
    capabilityOrder.value = 'reverse'
    projectLayout.value = 'absolute'
    status.value = 'playing'
  }
  function repair(id: RepairId) {
    if (!isBroken(id) || !repairIssues.some((issue) => issue.id === id)) return false
    const valid = {
      heading: headingOffset.value === 0,
      editor: editorRotation.value === 0,
      capabilities: capabilityOrder.value === 'source',
      projects: projectLayout.value === 'grid',
    }
    if (!valid[id]) {
      feedback.value[id] = 'Still failing. Check the hint and preview your change before applying.'
      return false
    }
    completed.value.push(id)
    feedback.value[id] = 'Check passed.'
    if (completed.value.length === repairIssues.length) status.value = 'results'
    return true
  }
  function exit() {
    status.value = 'idle'
    completed.value = []
    feedback.value = {}
    headingOffset.value = 0
    editorRotation.value = 0
    capabilityOrder.value = 'source'
    projectLayout.value = 'grid'
  }
  return {
    status,
    completed,
    headingOffset,
    editorRotation,
    capabilityOrder,
    projectLayout,
    feedback,
    progress,
    isBroken,
    open,
    repair,
    exit,
  }
})
