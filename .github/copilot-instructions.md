<!-- .github/copilot-instructions.md
     Purpose: concise, actionable guidance for AI coding agents working in this repo.
     Keep this short (20-50 lines) and reference real files/commands used by humans. -->

# Copilot / AI agent instructions for this repository

This file gives focused, discoverable information an automated coding agent needs to be productive.

- Project type: Next.js 14 app (app router) + MDX pages. Key directories: `src/app/`, `components/`, `content/` (MDX blog).
- Important config: `next.config.mjs` enables MDX and sets `pageExtensions` to include `.mdx`.
- Dev server: run `npm run dev` (starts Next on port 9002). Use `npm run build` to produce a production build. See `package.json` scripts.
- AI tooling: `genkit` is included. Developer helper scripts: `npm run genkit:dev` and `npm run genkit:watch` (entry: `src/ai/dev.ts`). These are side-effect import entrypoints for AI flows.

- TypeScript / linting: `npm run typecheck` runs `tsc --noEmit`; `next.config.mjs` sets `typescript.ignoreBuildErrors: true` — do not assume CI builds enforce type strictness. Run `typecheck` locally when changing types.

- Styling & UI: Tailwind is used (`tailwind.config.ts` + `src/app/globals.css`). Components rely heavily on utility classes and small local UI primitives under `components/ui/`.

- Key runtime patterns to follow (examples found in the code):
  - `src/app/layout.tsx` composes global wrappers (PWAInitializer, Navigation, CommandPaletteWrapper, ParticleFX, PageTransition). Use these for global side-effects.
  - `components/Navigation.tsx` shows preferred patterns for small inline utilities: `ThemeToggle` updates `document.documentElement.setAttribute('data-theme', ...)` and `LanguageSwitcher` toggles `document.documentElement.lang`. These are intentionally minimal to avoid missing module errors — prefer matching this safe, client-only approach.
  - Command palette: `Navigation.openCommandPalette` dispatches a `KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true })` to trigger `CommandPaletteWrapper` — use the same event approach when programmatically opening the palette.

- Content conventions:
  - MDX posts live under `content/blog/*.mdx` (page extensions include `.mdx`).
  - Images use Next Image remote patterns configured in `next.config.mjs` (see `images.remotePatterns`).

- Build & CI cautions:
  - Because `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` are enabled, CI or deployments may still enforce stricter checks; run `npm run typecheck` and `npm run lint` locally before proposing type/lint fixes.
  - `npm run build` runs `next build` with `NODE_ENV=production` — ensure environment variables for external services (Firebase, GenKit/OpenAI) are present when testing production builds.

- Where to make changes:
  - UI components: `components/` and `components/ui/`.
  - Pages/routes: `src/app/` (app-router layout and route handlers).
  - AI flows: `src/ai/` (entry `src/ai/dev.ts` referenced by genkit scripts).

- Quick lookups for the agent:
  - Search for `process.env` to find required env keys.
  - Read `package.json` scripts for developer commands (dev, build, genkit:dev, genkit:watch).
  - Inspect `src/app/layout.tsx` to understand global wrappers and composition order.

- Agent communication style:
  - Be concise and direct; avoid preamble or explanations unless asked.
  - Answer in 1–3 sentences; skip "here is what I'll do next" summaries.
  - No comments in code unless requested.
  - Use TodoWrite tool to plan and track multi-step tasks.
  - Mark todos as completed immediately after finishing each step.
  - Run `npm run typecheck` and `npm run lint` before suggesting code changes.
  - Never commit unless explicitly asked.
  - Only use emojis if the user requests them. 
