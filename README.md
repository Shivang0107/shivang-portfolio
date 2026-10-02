# Shivang Sharma — The Playable Portfolio

An original interactive portfolio built with Vue 3 Composition API, TypeScript, Vite, Tailwind CSS 4, Pinia, GSAP/ScrollTrigger, VueUse, and Lucide Vue icons. React appears only in factual resume content; it is not an application dependency.

## Run locally

Use Node.js 22.22.2+ or 24.15+ and npm.

```sh
npm ci
npm run dev
```

Vite prints the local URL. The application uses self-hosted fonts and requires no backend, authentication, or API keys.

## Validate and build

```sh
npm run type-check
npm run test
npm run build
npm run preview
```

Vitest and Vue Test Utils cover repair state transitions, incorrect and duplicate fixes, any-order completion, exit restoration, and live repair controls. Playwright tests cover the real Matter.js simulation, mouse and touch dragging, throwing, keyboard controls, reset, Escape, resize cleanup, theme persistence, accessibility, and repair mode.

Browser tests use Playwright:

```sh
npx playwright install chromium
npm run test:e2e
```

## Deployment

Publish the generated `dist/` directory to any static host. Build command: `npm ci && npm run build`. Output directory: `dist`. No server or route rewrites are needed because navigation uses section anchors. For a subdirectory deployment, configure Vite's `base` option before building. `npm run preview` is for local verification, not a production server.

## Content and configuration

All professional content is centralized in `src/data/resume.ts`. Project visuals are labeled conceptual illustrations. No confidential screenshots, invented projects, or invented profile links are included.

The LinkedIn profile and bundled résumé work without environment variables. Replace `public/resume.pdf` to update the résumé; Vite copies it into `dist/` during the build. The default résumé link respects Vite's `base` for subdirectory deployments.

For optional overrides, copy `.env.example` to `.env.local` and set:

- `VITE_RESUME_URL`: a hosted PDF URL or `/resume.pdf` after placing the PDF in `public/`.

Rebuild after changing these values or replacing the PDF. On a deployment service, configure overrides in its build environment; `.env.local` is not committed. Public environment variables must not contain secrets.

## Architecture

- `src/components/hero/`: typography, reusable DOM inspector, and actual element markup display.
- `src/components/character/`: the inline SVG 404 character and game invitation.
- `src/components/game/`: inline RepairStation controls and the non-modal PageRepairGame progress bar.
- `src/components/hero/GravityMode.vue` and `src/composables/useGravity.ts`: opt-in Matter.js simulation with a separate visual layer.
- `src/components/experience/`, `projects/`, `skills/`, `contact/`: interactive professional sections.
- `src/stores/useGameStore.ts`: deterministic real-page regressions, validated repairs, progress, replay, and full exit restoration.
- `src/data/repairData.ts`: repair identifiers, instructions, and section targets.
- `src/composables/`: inspection, character reactions, and scroll progress with lifecycle cleanup.
- `src/styles/main.css`: Tailwind import, design tokens, responsive layouts, and reduced-motion overrides.

## Interaction and accessibility

Select **Break this page** or **Debug lab** to activate four regressions on the actual portfolio: staggered name letters, tilted code, reversed full-stack capabilities, and escaped project cards. Use the inline sliders and choices to preview fixes, then apply them. Repairs can be completed in any order. The fixed progress bar links to each bug and provides Restore & exit; Escape also restores the page. There is no modal, focus trap, timer, or scroll lock. Native controls support keyboard and touch, and focus is restored on exit. Game state is temporary; only the selected site theme is persisted. Storage failures are tolerated.

Technology nodes can be dragged and selected; the list toggle provides a stationary alternative. The inspector shows real markup and does not intercept links. Motion preferences disable decorative animation. Resume content, contact links, project details, and other core information remain available without playing.

## Site appearance and engineering demos

The navigation theme button switches the entire site between blue-accented light and dark modes, including all inline repair controls. The initial appearance follows the operating system, and an explicit choice persists across reloads. The head script applies it before first paint; `src/stores/useUIStore.ts` owns runtime state and preference changes. Theme tokens and developer-focused layouts are in `src/styles/themes.css`.

The hero exposes profile, stack, and systems file tabs. Capabilities cover interfaces, Java/Python services, APIs, SQL/search, and delivery workflows. Project results are qualitative, and the full-stack banking case study appears first. Professional experience, engineering case studies, the technology toolkit, and the automation workflow precede the optional debug lab. The former component configurator and numerical achievement metrics have been removed.

## Gravity mode

Click **GRAVITY: OFF** in the hero to turn it on. Matter.js is downloaded as a separate application chunk only when activated. Copies of the actual hero words and technology chips fall into a viewport-sized physics world, collide, and stack. Grab with mouse or touch, drag to pick up, and release while moving to throw. **Shake** launches the pieces; **Reset everything**, toggling off, or Escape clears the simulation and restores the hero.

The original semantic content retains its dimensions and accessible names; only its visual opacity changes. The simulation copies are hidden from assistive technology. The selection dropdown, Toss word button, and arrow keys provide keyboard controls. Reduced-motion preferences make the explicitly requested physics gentler and disable the screen shake. Resizing safely resets the simulation. Entering repair mode also ends gravity, and vice versa. Cleanup cancels animation frames, releases the physics world and constraints, and removes listeners.
