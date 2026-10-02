<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '../../data/resume'
const copied = ref(false),
  copyError = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    copyError.value = false
  } catch {
    copyError.value = true
  }
}
</script>
<template>
  <section id="contact" class="section-shell contact-section">
    <div class="section-label">
      <span>07 / WHAT’S NEXT?</span><span>{{ profile.location }}</span>
    </div>
    <h2>
      LET’S BUILD<br />SOMETHING THAT<br />DESERVES TO BE <em>USED.</em
      ><span class="contact-arrow">↗</span>
    </h2>
    <div class="contact-bottom">
      <div>
        <p>Have a challenge worth solving?<br />I’d love to hear about it.</p>
        <a class="email-link" :href="'mailto:' + profile.email">{{ profile.email }} ↗</a
        ><button class="copy-email mono" @click="copy">
          {{ copied ? 'COPIED ✓' : 'COPY EMAIL' }}</button
        ><span v-if="copyError" role="status">Select the email address to copy it manually.</span
        ><span class="sr-only" role="status">{{ copied ? 'Email copied' : '' }}</span>
      </div>
      <div class="contact-links">
        <a :href="'tel:' + profile.phone">+91 8708028407 ↗</a
        ><a v-if="profile.linkedin" :href="profile.linkedin" target="_blank" rel="noopener"
          >LinkedIn ↗</a
        ><span v-else>LinkedIn · link coming soon</span
        ><a v-if="profile.resume" :href="profile.resume" target="_blank" rel="noopener"
          >Download resume ↓</a
        ><span v-else>Resume · available on request</span>
      </div>
    </div>
  </section>
</template>
