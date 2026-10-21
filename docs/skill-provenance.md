# Design and architecture references

- **design-taste-frontend-v2**: installed skill at `design-taste-frontend-v2/SKILL.md`. Imported design-taste-frontend guidance; metadata and origin were inspected. Applied the restrained single-accent palette, Geist typography, responsive grid, functional states, isolated map, and motion constraints. The required assessment cards take priority over generic anti-card preferences; perpetual data rearrangement was avoided because it would interfere with fleet inspection.
- **frontend-architecture**: [requested source](https://github.com/stareezy-1/frontend-architecture-skill/blob/main/skills/frontend-architecture/SKILL.md). Applied feature modules, page directories, public barrels, typed data access, server/UI state separation, scoped components, and colocated Tailwind styles.
- **tailwind-design-system**: [wshobson/agents source](https://github.com/wshobson/agents/blob/main/plugins/frontend-mobile-development/skills/tailwind-design-system/SKILL.md). Applied Tailwind v4 CSS-first semantic tokens, consistent component states, and responsive/accessibility patterns.
- **zustand**: installed pedronauck skill. Applied selectors, domain ownership, grouped actions, and no duplicated server data. A per-provider factory prevents cross-request state sharing under SSR.
- **PDF**: used the installed PDF skill to extract the assessment requirements.
- **find-skills**: used to locate the Tailwind skill. No global skill installation was required; the remote skill content was read directly.

Implementation references: installed Next.js documentation under `node_modules/next/dist/docs`, [Tailwind Vite/PostCSS documentation](https://tailwindcss.com/docs/installation/using-postcss), [MBTA API schema](https://api-v3.mbta.com/docs/swagger/swagger.json), and [Google guidance for AI search features](https://developers.google.com/search/docs/appearance/ai-features).

The user explicitly dropped Figma during the redesign. The current UI was implemented from live visual inspection of https://www.stareezy.tech/ and https://getartcraft.com/. Reference-derived choices include oversized condensed typography, outlined display text, orbital fine-line geometry, compact uppercase navigation, and sharp borders. Existing API behavior and module architecture were preserved. The redesign-existing-projects skill was applied; its optional metadata.json and ORIGIN.md were absent from the installed package. No design was added to Figma.

The latest pass applies the copywriting skill from coreyhaines31/marketingskills, including its AI-tells self-check. Copy rationale and alternatives are in `copy-notes.md`. The user requested a transit-bus animation and system-default themes, superseding the earlier orbital artwork and condensed display typography.

The subsequent UX pass used `comeonoliver/web-design-guidelines` for keyboard/focus behavior, touch targets, responsive reflow, and feedback states. Findings and source locations are documented in `ux-review.md`.
