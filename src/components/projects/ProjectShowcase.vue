<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../../stores/useGameStore'
import RepairStation from '../game/RepairStation.vue'
const game = useGameStore()
import { projects } from '../../data/resume'
const orderedProjects = [...projects].sort(
  (a, b) => Number(b.visual === 'rubberduck') - Number(a.visual === 'rubberduck'),
)
const selected = ref<number | null>(null)
function toggleProject(index: number) {
  selected.value = selected.value === index ? null : index
}
</script>
<template>
  <section id="work" class="section-shell section-space">
    <div class="section-label">
      <span>03 / SELECTED WORK</span><span>A FEW THINGS I’VE HELPED SHIP</span>
    </div>
    <div class="section-heading">
      <h2>Selected<br /><em>engineering work.</em></h2>
      <p>
        Architecture, implementation, and outcomes.<br />Work shipped across the frontend and
        backend.
      </p>
    </div>
    <RepairStation issue="projects" />
    <div
      class="project-grid"
      :class="game.isBroken('projects') ? 'project-layout-' + game.projectLayout : ''"
    >
      <article v-for="(project, i) in orderedProjects" :key="project.title" class="project">
        <component
          :is="project.url ? 'a' : 'button'"
          class="project-open"
          :href="project.url"
          :target="project.url ? '_blank' : undefined"
          :rel="project.url ? 'noopener noreferrer' : undefined"
          :aria-label="project.url ? `Visit ${project.title} (opens in a new tab)` : undefined"
          :aria-expanded="project.url ? undefined : selected === i"
          :aria-controls="project.url ? undefined : 'project-' + i"
          @click="project.url ? undefined : toggleProject(i)"
        >
          <div class="project-visual" :class="project.visual">
            <span class="concept-label mono">CONCEPTUAL UI / NOT A PRODUCT SCREENSHOT</span>
            <div v-if="project.visual === 'webmd'" class="health-mock">
              <header>WebMD<span>Health, thoughtfully delivered.</span></header>
              <div class="health-layout">
                <div>
                  <small>INFORMATION THAT MATTERS</small>
                  <h3>Better health.<br />Every day.</h3>
                  <span class="mock-pill">Explore your health →</span>
                </div>
                <div class="health-art">+</div>
              </div>
              <footer>
                <span>01 / Articles</span><span>02 / Resources</span><span>03 / Quizzes</span>
              </footer>
            </div>
            <div v-else-if="project.visual === 'embody'" class="embody-mock">
              <b>you<span>embody</span></b>
              <div class="embody-circle"></div>
              <h3>More you.<br />Every day.</h3>
              <small>SPACE TO FEEL LIKE YOURSELF.</small>
            </div>
            <div v-else-if="project.visual === 'migration'" class="migration-mock">
              <span>THE NEXT ITERATION</span>
              <div><b>2</b><i>→</i><b>3</b><i>→</i><strong>ϟ</strong></div>
              <p>Less waiting. More creating.</p>
              <small>VUE / VUE 3 / VITE</small>
            </div>
            <div v-else-if="project.visual === 'rubberduck'" class="duck-mock">
              <header><span aria-hidden="true">🦆</span> THE RUBBER DUCK</header>
              <h3>Think out loud.<br />Find your own solution.</h3>
              <div class="duck-question">
                <span class="mono">DUCK ASKS</span>What work are you repeating?
              </div>
              <footer class="mono">PROBLEM → QUESTIONS → INSIGHT</footer>
            </div>
            <span class="project-arrow">{{ !project.url && selected === i ? '−' : '↗' }}</span>
          </div>
          <div class="project-meta">
            <span class="mono">0{{ i + 1 }} / {{ project.type }}</span>
            <h3>{{ project.title }}</h3>
            <p>{{ project.subtitle }}</p>
            <span class="project-tech mono">{{ project.technologies }}</span>
            <span class="project-action-label">
              {{
                project.url
                  ? 'Visit website ↗'
                  : selected === i
                    ? 'Hide project details −'
                    : 'View project details +'
              }}
              <small v-if="project.url">Opens in a new tab</small>
            </span>
          </div></component
        >
        <button
          v-if="project.url"
          class="project-action-label project-details-link"
          :aria-expanded="selected === i"
          :aria-controls="'project-' + i"
          @click="toggleProject(i)"
        >
          {{ selected === i ? 'Hide project details −' : 'View project details +' }}
        </button>
        <Transition name="expand"
          ><div v-if="selected === i" :id="'project-' + i" class="project-detail">
            <dl>
              <dt>Context</dt>
              <dd>{{ project.context }}</dd>
              <dt>My contribution</dt>
              <dd>{{ project.contribution }}</dd>
              <dt>Technical approach</dt>
              <dd>{{ project.approach }}</dd>
              <dt>Outcome</dt>
              <dd class="accent">{{ project.outcome }}</dd>
            </dl>
          </div></Transition
        >
      </article>
    </div>
  </section>
</template>
