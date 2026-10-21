# Demo guide (approximately 7 minutes)

For full narration, timestamps, source-file cues, and a recording checklist, use [video-script.md](video-script.md).

This is a recording outline, not a recorded demo. Run the app with an internet connection and a working MBTA feed before recording.

## 0:00–0:45 — Introduce the product

Show the overview. Explain that Transit Desk implements the Transjakarta assessment using the specified MBTA API, so the live geography is Greater Boston. Mention Next.js, React, TypeScript, and Tailwind.

## 0:45–2:00 — Explain data retrieval

Show `src/shared/api-client/index.ts`, the fleet service, and query hooks. Explain native `fetch`, JSON:API relationships, the server gateway, abort signals, timeout, and TanStack Query caching. Initial vehicle content is rendered on the server. Client refresh happens every 30 seconds while active. Demonstrate Refresh feed and distinguish sync time from vehicle update time.

## 2:00–3:15 — Filters and lazy options

Open Routes, select two routes, and scroll to load more options. Open Trips and select two trips. Explain OR within each dropdown and AND across categories. Trips come from the API and may have no currently reporting vehicle. Change routes to demonstrate clearing old trips. Search is explicitly scoped to loaded dropdown options.

## 3:15–4:15 — Pagination

Show range, total records, page count, numbered navigation, and page-size selection. Explain that pagination is a small typed client-side utility applied after filtering the complete vehicle snapshot. The API prohibits combining trip and route filters directly, so this approach preserves correct matching counts. Mention the larger-network server aggregation tradeoff.

## 4:15–5:15 — UI and vehicle details

Open a vehicle. Show source status, coordinates, route, trip, stop, direction, timestamp, and Leaflet map. Explain Tailwind v4 design tokens, colocated style maps, Space Grotesk and Geist Mono fonts, Phosphor icons, Radix accessibility, and the transit-inspired design. Resize to mobile and use Escape to close the popup.

## 5:15–6:15 — Architecture and rendering

Show the module folders and public barrels. Explain TanStack Query server state versus Zustand UI state, request-scoped stores, and components that call hooks instead of fetching. Explain SSR for live data, CSR for interactions and browser-only Leaflet, and SSG for the field guide.

## 6:15–7:15 — Quality, SEO, and wrap-up

Show an empty result, the automated test results, the field guide FAQ, canonical metadata, sitemap, and JSON-LD. Explain source-grounded content for answer engines and the need for a real deployment origin. Do not claim guaranteed ranking or AI citations. End with the public repository and deployment URL once those have actually been created.
