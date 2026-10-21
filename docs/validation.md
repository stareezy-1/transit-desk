# Validation evidence

Validated locally on 15 October 2026 (Asia/Jakarta).

## Automated checks

- TypeScript strict type checking: passed.
- Vitest: **12 tests passed**, across filtering, pagination, missing coordinates, API normalization/pagination, required trip filters, untrusted pagination origins, UI-state transitions, and request-isolated stores.
- Playwright / installed Google Chrome: **5 browser scenarios passed**. Covers pagination and page size, search/status/empty results, multi-route and multi-trip selection, automatic scroll loading, trip reset after route changes, popup fields and map, Escape/focus restoration, failed refresh with retained data, mobile overflow, guide metadata, and crawler routes.
- Prettier: all matched source and documentation files passed.
- Next.js production build: passed with the supported Webpack builder. Type checking and static generation complete.

The first Turbopack build was blocked by a local process-binding error (`Operation not permitted` when creating a PostCSS worker port). The production script uses `next build --webpack`; this was successfully validated. This is a local tool limitation, not a claimed Turbopack application compatibility result.

## Rendering verification

Next.js build output classifies `/` and `/api/transit/[...path]` as dynamic server routes. `/guide`, `/robots.txt`, `/sitemap.xml`, and `/opengraph-image` are statically prerendered. Leaflet is a separate dynamic client import with SSR disabled; filters and pagination are hydrated client interactions.

## Real API smoke check

The separate `tests/visual-check.mjs` run used **real MBTA responses**, with no network mocks:

- Six initial cards rendered from the fleet snapshot.
- Route dropdown returned 25 live API choices.
- Trip dropdown returned 25 API choices using the revenue filter.
- Vehicle details loaded and Leaflet rendered a real coordinate marker.
- No uncaught browser errors.
- No horizontal overflow at 390 px viewport width.
- Screenshots captured for desktop, mobile, vehicle details, and the static field guide.

Public data changes continuously; screenshot counts and vehicle positions are observations, not fixtures or predictions.

## Visual and accessibility checks

Desktop and mobile screenshots were inspected. Dialogs and dropdowns use Radix keyboard/focus behavior. The popup Escape path and focus destination were exercised. Reduced-motion CSS is supplied, controls have accessible names, and pagination has current-page semantics. Secondary text uses a darker semantic token to exceed 4.5:1 contrast on the app canvas. This is targeted verification, not a formal accessibility certification.

## Remaining delivery steps

The project has not been pushed to GitHub, publicly deployed, or submitted. The included demo guide has not been recorded. A real deployment must set `NEXT_PUBLIC_SITE_URL` before building so canonical, sitemap, and structured-data URLs use the intended domain.

## Reference-led redesign verification

The initial teal UI was replaced with a charcoal editorial composition after user feedback. The redesign was checked through the in-app browser at desktop size and 390 px mobile width. Live checks covered pagination, two selected routes, 25 loaded trip options, empty search results, reset, and a vehicle popup with map. The mobile document width remained exactly 390 px, with no horizontal overflow. TypeScript and all 12 unit tests passed after the visual changes. The five Playwright scenarios above describe the earlier implementation; they were retained and their section locator updated, while current visual interaction checks used the in-app browser.

Current screenshots use the `-v2.jpg` suffix. Earlier PNGs record the superseded design.

## Bus animation and themes

The orbital scene was replaced by a custom SVG transit bus with CSS-only travel, wheel, door, road, and passenger motion. The animation is isolated in a memoized component. Pause/Play controls freeze all animated descendants; `prefers-reduced-motion` displays the static bus and hides the unnecessary motion control.

A shared `next-themes` provider defaults to System and supports persisted Light/Dark overrides. Semantic tokens cover page backgrounds, surfaces, typography, borders, controls, errors, and the illustration ground plane. Its pre-hydration script resolves the saved or system preference. The theme control delays client-dependent selection until mounted. The original warm-paper and charcoal palettes are both deliberate themes.

Verified in the in-app browser: System matched the machine's dark preference; Light persisted across reload and navigation; Pause produced a paused computed animation state. The 12 domain tests and type checking passed after the implementation. Further screenshot and build evidence is recorded in the task conversation.

Final theme checks: Light remained selected after reload and when opening the guide. The 390 px mobile viewport had no horizontal overflow after adjusting the SVG bleed. Dark dropdown options were inspected with 25 real route choices. Secondary text contrast is 4.72:1 on the light canvas and 8.14:1 on the dark canvas; the accent is 5.05:1 and 8.06:1 respectively. System mode was restored after verification. CSS reduced-motion behavior was inspected; the operating system accessibility setting was not changed during this check.

## Full PDF audit

The subsequent audit supersedes the earlier spot checks. See `pdf-audit.md` and `audit-results.json` for measured desktop/mobile viewport coverage in both themes, controlled failure/loading scenarios, and timed automatic-refresh regression checks.
