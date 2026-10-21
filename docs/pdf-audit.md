# Frontend assessment audit

Source: `Tes Teknis Frontend.pdf`, pages 1–3, reread during this audit on 15 October 2026. This audit distinguishes application requirements from external submission steps.

## Test environments

- Desktop: 1440 × 900 CSS pixels, Light and Dark.
- Mobile: 390 × 900 CSS pixels, Light and Dark. This is responsive browser emulation, not a physical handset.
- An isolated Next.js development app on port 3002 uses a loopback fixture API on port 4319. It exercises the real page, hooks, gateway, services, and UI with controlled responses. Port 3000 continues to use real MBTA data.
- The test API override only works in development, accepts loopback origins only, and does not receive MBTA credentials. Production always uses the MBTA API. Unit tests cover these boundaries.
- All interactions were performed through the in-app browser. Each viewport was checked using its actual `innerWidth`; the earlier hidden-tab attempt was discarded when it was found to have a fixed viewport.

## PDF requirements

| PDF requirement                               | Implementation and evidence                                                                      | Status           |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------- |
| React, hooks, functional components           | Next.js App Router with React functions and typed hooks                                          | Pass             |
| REST vehicle data                             | MBTA client, same-origin gateway, complete paginated snapshot                                    | Pass             |
| Card grid with label                          | Six visible cards by default; labels and route context checked                                   | Pass             |
| Current vehicle status                        | All three status values represented and status filters checked                                   | Pass             |
| Latitude and longitude                        | Card and popup coordinates checked against fixture values                                        | Pass             |
| Last update time                              | Source time on each card; full date/time in popup                                                | Pass             |
| Displayed data range and total                | First, middle, final partial page, and empty range verified                                      | Pass             |
| Adjustable page size                          | 6, 12, and 24 verified; page resets on size change                                               | Pass             |
| Total page count and page navigation          | Numbered, previous, next, and disabled empty-state controls                                      | Pass             |
| Route dropdown from API                       | Initial 25 options, next 25 lazy-loaded; option search and selection                             | Pass             |
| Trip dropdown from API                        | Initial 25 options, next 25 lazy-loaded; multiple selection                                      | Pass             |
| Multiple routes and multiple trips            | OR within a dropdown, AND across dropdowns; route changes clear trips                            | Pass             |
| Infinite scroll / lazy load                   | Selecting the last loaded option scrolls the menu and fetches the next page automatically        | Pass             |
| Vehicle popup                                 | Label, status, coordinates, full timestamp, route, trip, stop, direction, occupancy, speed       | Pass             |
| Bonus vehicle map                             | Leaflet container, coordinate marker and OpenStreetMap link; missing coordinates omit the map    | Pass             |
| Loading indicators                            | Fleet refresh busy state, dropdown skeletons, detail skeleton, map loading, SSR loading boundary | Pass             |
| Understandable errors                         | Vehicle, route, trip and detail failures; retry recovery; malformed JSON; stale data retained    | Pass             |
| Bonus TypeScript                              | Strict type checking and production build                                                        | Pass             |
| README with run instructions and architecture | Root README, module READMEs, rendering/state/API tradeoffs                                       | Pass             |
| Public GitHub repository                      | No repository was published during this local audit                                              | Pending delivery |
| 5–10 minute demo video                        | Recording outline exists; no video has been recorded or submitted                                | Pending delivery |

## Fixes made during the audit

1. **Cached dropdown refresh visibility:** options now show a `Refreshing routes/trips…` status when cached data is refetched, in addition to initial and next-page loading indicators.
2. **Page state after shrinking data:** the page stored in the UI state is clamped when a refreshed fleet has fewer pages. Regrowing the fleet no longer unexpectedly jumps back to the formerly selected high page.
3. **Malformed API responses:** invalid JSON and invalid list/detail envelopes produce readable errors rather than parsing or property-access messages.
4. **Missing-position presentation:** an unavailable coordinate state no longer uses a perpetual loading shimmer.
5. **Route-transition scrolling:** added the Next.js 16 `data-scroll-behavior="smooth"` declaration so route changes can temporarily disable document smooth scrolling. This removes the framework warning and prevents animated scrolling from interfering with navigation.
6. **Visual changes:** the split marketing hero became a panoramic study plate below a workspace masthead. Dark theme surfaces were changed from green-tinted values to neutral graphite.

## Final results

- 19 unit tests passed.
- 16 browser audit groups passed: four groups across each of the four viewport/theme combinations. Detailed records are in `audit-results.json`; the CUA REPL helpers are preserved in `tests/support/in-app-audit.js`.
- Each mode passed core functionality, loading/error/recovery cases, automatic refresh with page clamping, and card/theme/guide checks.
- The live MBTA app was separately checked in all four layouts after the navigation fix. It loaded 25 real route options and 25 real trip options.
- Production build and TypeScript checking passed. Temporary QA servers and tabs were stopped; the live preview remains at port 3000 with System theme restored.

## Scope and limits

The matrix covers the features above in Chromium at the stated viewport sizes. It does not establish Safari, Firefox, or physical-device behavior. Map tiles remain an external dependency. Reduced-motion CSS was inspected; the operating system accessibility preference was not changed. System theme matching and persisted overrides are tested without changing the user's system appearance setting.

The submission steps are tracked as pending rather than treating a local build or ZIP as a public submission.
