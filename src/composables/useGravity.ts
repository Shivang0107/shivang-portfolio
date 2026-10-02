import { onUnmounted, ref } from 'vue'
import type { Body, Engine, Constraint } from 'matter-js'
type MatterAPI = typeof import('matter-js')
export interface FallingWord {
  id: number
  label: string
  width: number
  height: number
  x: number
  y: number
  angle: number
  fontSize: string
  fontFamily: string
  fontWeight: string
  letterSpacing: string
  chip: boolean
}
export function useGravity() {
  const words = ref<FallingWord[]>([]),
    running = ref(false),
    selected = ref(0)
  let M: MatterAPI | undefined,
    engine: Engine | undefined,
    bodies: Body[] = [],
    drag: Constraint | undefined
  let frame = 0,
    generation = 0,
    last = 0,
    accumulator = 0,
    pointerId: number | null = null
  let lastPointer = { x: 0, y: 0, time: 0 },
    velocity = { x: 0, y: 0 },
    reduced = false
  const step = 1000 / 60
  function render() {
    words.value = words.value.map((word, i) => ({
      ...word,
      x: bodies[i]!.position.x,
      y: bodies[i]!.position.y,
      angle: bodies[i]!.angle,
    }))
  }
  function loop(time: number) {
    if (!running.value || !M || !engine) return
    if (!document.hidden) {
      accumulator += Math.min(64, Math.max(0, time - (last || time)))
      while (accumulator >= step) {
        M.Engine.update(engine, step)
        accumulator -= step
      }
      const floor = window.innerHeight - 110
      bodies.forEach((body, i) => {
        // Recover a body thrown through a boundary at very high pointer velocity.
        if (
          body.position.y > floor + 100 ||
          body.position.x < -100 ||
          body.position.x > innerWidth + 100
        ) {
          M!.Body.setPosition(body, {
            x: Math.min(
              innerWidth - words.value[i]!.width / 2 - 10,
              Math.max(words.value[i]!.width / 2 + 10, body.position.x),
            ),
            y: Math.min(floor - 60, Math.max(100, body.position.y)),
          })
          M!.Body.setVelocity(body, { x: 0, y: 0 })
        }
      })
      render()
    }
    last = time
    frame = requestAnimationFrame(loop)
  }
  function stop() {
    generation++
    running.value = false
    cancelAnimationFrame(frame)
    if (M && engine) {
      M.Composite.clear(engine.world, false)
      M.Engine.clear(engine)
    }
    engine = undefined
    bodies = []
    words.value = []
    drag = undefined
    pointerId = null
    last = 0
    accumulator = 0
    window.removeEventListener('resize', stop)
  }
  async function start(root: HTMLElement) {
    stop()
    const ticket = generation
    const module = await import('matter-js')
    if (ticket !== generation) return false
    M = module.default
    await document.fonts.ready
    if (ticket !== generation) return false
    root.scrollIntoView({ behavior: 'instant', block: 'start' })
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const snapshots = Array.from(root.querySelectorAll<HTMLElement>('[data-gravity]')).map(
      (el, i) => {
        const rect = el.getBoundingClientRect(),
          style = getComputedStyle(el)
        const width = Math.min(rect.width, innerWidth - 24),
          height = rect.height
        return {
          id: i,
          label: el.textContent?.trim().replace(/\s+/g, ' ') || '',
          width,
          height,
          x: Math.max(width / 2 + 12, Math.min(innerWidth - width / 2 - 12, rect.left + width / 2)),
          y:
            rect.top < innerHeight - 170
              ? Math.max(90 + height / 2, rect.top + height / 2)
              : 100 + (i % 4) * 65,
          angle: 0,
          fontSize: style.fontSize,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
          chip: !!el.closest('.hero-stack'),
        }
      },
    )
    words.value = snapshots
    engine = M.Engine.create({
      enableSleeping: true,
      gravity: { x: 0, y: reduced ? 0.45 : 1, scale: 0.001 },
    })
    bodies = snapshots.map((word) =>
      M!.Bodies.rectangle(word.x, word.y, word.width, word.height, {
        restitution: reduced ? 0.08 : 0.25,
        friction: 0.65,
        frictionAir: 0.012,
        sleepThreshold: 90,
        chamfer: { radius: 3 },
      }),
    )
    const floor = innerHeight - 110
    M.Composite.add(engine.world, [
      ...bodies,
      M.Bodies.rectangle(innerWidth / 2, floor + 30, innerWidth + 100, 60, { isStatic: true }),
      M.Bodies.rectangle(-30, innerHeight / 2, 60, innerHeight * 4, { isStatic: true }),
      M.Bodies.rectangle(innerWidth + 30, innerHeight / 2, 60, innerHeight * 4, { isStatic: true }),
      M.Bodies.rectangle(innerWidth / 2, -160, innerWidth + 100, 60, { isStatic: true }),
    ])
    selected.value = 0
    running.value = true
    frame = requestAnimationFrame(loop)
    window.addEventListener('resize', stop)
    return true
  }
  function grab(event: PointerEvent, id: number) {
    if (!M || !engine || pointerId !== null || event.button !== 0) return
    const body = bodies[id]
    if (!body) return
    event.preventDefault()
    selected.value = id
    pointerId = event.pointerId
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    M.Sleeping.set(body, false)
    const dx = event.clientX - body.position.x,
      dy = event.clientY - body.position.y,
      angle = -body.angle
    drag = M.Constraint.create({
      bodyB: body,
      pointB: {
        x: dx * Math.cos(angle) - dy * Math.sin(angle),
        y: dx * Math.sin(angle) + dy * Math.cos(angle),
      },
      pointA: { x: event.clientX, y: event.clientY },
      stiffness: 0.2,
      damping: 0.12,
      length: 0,
    })
    M.Composite.add(engine.world, drag)
    lastPointer = { x: event.clientX, y: event.clientY, time: performance.now() }
    velocity = { x: 0, y: 0 }
  }
  function move(event: PointerEvent) {
    if (!drag || pointerId !== event.pointerId) return
    const now = performance.now(),
      dt = Math.max(8, now - lastPointer.time)
    velocity = {
      x: Math.max(-18, Math.min(18, ((event.clientX - lastPointer.x) / dt) * step)),
      y: Math.max(-18, Math.min(18, ((event.clientY - lastPointer.y) / dt) * step)),
    }
    drag.pointA = { x: event.clientX, y: event.clientY }
    lastPointer = { x: event.clientX, y: event.clientY, time: now }
  }
  function release(event: PointerEvent) {
    if (!M || !engine || pointerId !== event.pointerId) return
    if (drag) {
      const body = drag.bodyB
      M.Composite.remove(engine.world, drag)
      if (body && event.type === 'pointerup' && performance.now() - lastPointer.time < 130)
        M.Body.setVelocity(body, velocity)
    }
    drag = undefined
    pointerId = null
    const el = event.currentTarget as HTMLElement
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
  }
  function toss(id = selected.value) {
    if (!M || !bodies[id]) return
    M.Sleeping.set(bodies[id]!, false)
    M.Body.setVelocity(bodies[id]!, {
      x: (id % 2 ? -1 : 1) * (reduced ? 2 : 5),
      y: reduced ? -5 : -11,
    })
    M.Body.setAngularVelocity(bodies[id]!, reduced ? 0.015 : 0.06)
  }
  function shake() {
    bodies.forEach((_, i) => toss(i))
  }
  function nudge(key: string) {
    if (!M || !bodies[selected.value]) return
    const body = bodies[selected.value]!
    M.Sleeping.set(body, false)
    const delta: Record<string, { x: number; y: number }> = {
      ArrowLeft: { x: -18, y: 0 },
      ArrowRight: { x: 18, y: 0 },
      ArrowUp: { x: 0, y: -24 },
      ArrowDown: { x: 0, y: 18 },
    }
    if (delta[key]) {
      M.Body.translate(body, delta[key]!)
      M.Body.setVelocity(body, { x: 0, y: 0 })
    }
  }
  onUnmounted(stop)
  return { words, running, selected, start, stop, grab, move, release, shake, toss, nudge }
}
