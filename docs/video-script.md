# Transit Desk implementation video script

Target duration: **9 minutes 30 seconds**, including clicks and short pauses. Spoken language: English. Read the narration at approximately 125–140 words per minute. Rehearse once and keep the final recording between **5 and 10 minutes**, as required by the assessment.

Repository: https://github.com/stareezy-1/transit-desk

This is a ready-to-read script and recording plan. It is not a recorded or submitted video.

## Before recording

1. Run `npm ci`, copy `.env.example` to `.env.local`, and run `npm run dev`.
2. Open the app at `http://127.0.0.1:3000`. Confirm that the live feed has reporting vehicles. Counts and timestamps change; do not read a fixed vehicle count from this script.
3. Keep the browser at a desktop width. Prepare responsive mode at 390 px for the mobile segment.
4. Open the source files listed below in editor tabs before recording. Hide notifications, account settings, `.env.local`, tokens, browser bookmarks, and unrelated windows.
5. Run `npm test` and `npm run build` before recording. Keep the actual successful terminal output available. Do not claim that browser tests ran today unless you run them today.
6. Select a route that currently has vehicles. Note one trip ID from a vehicle popup, so you can demonstrate a matching trip rather than choose a random scheduled trip.
7. If the public feed is empty or unavailable, use the fixture walkthrough described at the end and explicitly identify it as controlled test data.

## 0:00–0:40 — Introduce the application

**Show:** The public GitHub repository, then the application overview.

**Say:**

“Hello, I’m Bintang. This is Transit Desk, my implementation of the frontend fleet-management assessment.

The application uses Next.js App Router, React functional components, TypeScript, and Tailwind CSS. Its vehicle information comes from the MBTA REST API specified in the brief. That means the positions shown here cover Greater Boston.

I’ll demonstrate the main user flow, explain how the data and pagination work, and then walk through the code architecture and validation.”

## 0:40–1:35 — Read a vehicle card and open details

**Do:** Scroll to the fleet. Point at a card’s label, status, coordinates, and last signal. Open Details. Show the map, route, trip, stop, and full update timestamp. Close using Escape.

**Say:**

“Each vehicle card shows the required label, current status, latitude, longitude, and last reported update. The status describes its position relative to a stop. It does not tell us whether the service is on time.

Opening Details requests that vehicle’s data, including its route, trip, and stop relationships. The popup adds direction, occupancy, and speed when the feed provides them.

The bonus map uses Leaflet with OpenStreetMap tiles. If coordinates are missing, the application explains that the position is unavailable and leaves the map out.

Closing the popup returns keyboard focus to the same vehicle button, so the user can continue from their previous position.”

## 1:35–2:40 — Demonstrate the main filtering flow

**Do:** Search for a visible vehicle label and clear the search. Open Routes; choose two routes and scroll the menu to load another batch. Open Trips, select multiple options, and close it. Show active selection chips. Remove a chip. Change routes to show trip reset. Reset filters.

**Say:**

“The main flow is to find a vehicle, narrow the result set, and inspect its journey.

Search matches vehicle labels, IDs, routes, and destinations. Routes and Trips are separate multi-select dropdowns. Each loads options from its own API endpoint in batches of twenty-five. Scrolling near the end loads the next batch, and Load more provides an explicit alternative.

The dropdown search covers options already loaded. This limitation is stated beside the control, so users know when to load another batch.

Selections within one category use OR. Route and trip categories combine with AND. Selected values remain visible as removable chips.

Changing routes clears selected trips because the previous trips may no longer belong to the chosen routes. Scheduled trips can also have no currently reporting vehicle; an empty result is valid and includes a reset action.”

## 2:40–3:25 — Explain and demonstrate pagination

**Do:** Show the current range and total. Use Next and a numbered page. Change page size to 12, then return to 6. Point out result focus/scroll behavior.

**Say:**

“Pagination is implemented with a small pure TypeScript function. It receives the filtered records, requested page, and page size, then calculates the visible slice, range, total, and number of pages.

The interface supports six, twelve, or twenty-four vehicles per page. It includes previous and next controls and numbered navigation on desktop. Mobile uses a direct page selector.

Changing a filter or page size returns to page one. Clearing filters preserves the user’s page-size preference. If a refresh reduces the number of available pages, the stored page is clamped to a valid value.

When a user changes pages, focus and scroll move to the result heading.”

## 3:25–4:35 — Show data retrieval and API constraints

**Show:** `src/shared/api-client/index.ts`, `src/modules/fleet/services/fleet.service.ts`, then `src/modules/fleet/hooks/useFleetQueries.ts`.

**Say:**

“Data retrieval uses the browser and server’s native fetch API through one typed client. The client applies a fifteen-second timeout, accepts cancellation signals, and converts network or HTTP failures into readable messages.

Server rendering calls MBTA directly. Browser requests use the Next.js route handler at `/api/transit`. An optional API key stays on the server.

The fleet service reads JSON:API resources and included relationships and converts them into the vehicle model used by the UI. It follows next-page links and deduplicates vehicle IDs.

There is an important API constraint: MBTA does not allow the vehicle trip filter to be combined with other vehicle filters. I therefore fetch the complete fleet snapshot and apply the route and trip intersection locally. Pagination follows that filtering step, which keeps counts consistent with the fetched snapshot.

For a much larger fleet, I would move that combined filtering and counting into a server aggregation layer.”

## 4:35–5:25 — Explain query behavior, loading, and failure handling

**Show:** Query hooks and `src/app/providers.tsx`. Click Refresh feed. Search for a nonexistent vehicle to show the empty state, then reset.

**Say:**

“TanStack Query owns server data, caching, fetching status, and errors. Query keys distinguish the fleet snapshot, individual vehicles, and dropdown option pages.

The fleet refreshes every thirty seconds while the page is active. Refresh feed lets the user request an update immediately. The snapshot sync time and each vehicle’s source timestamp are displayed separately.

Initial loading uses skeletons. Dropdowns and the detail popup also show fetching indicators. A failed fleet refresh retains the last successful data and displays a retry action.

Transient failures are retried once. Bad requests, missing resources, and rate limits do not automatically retry. An empty result explains how to broaden the search.”

## 5:25–6:30 — Walk through architecture and rendering

**Show:** Source directory tree, module barrel, `src/app/page.tsx`, store factory, and `src/app/guide/page.tsx`.

**Say:**

“The architecture is organized by feature. The fleet module owns its page, local components, hooks, services, types, utilities, and UI store. The guide is a separate module. Routing imports each feature through its public barrel.

Components obtain remote data through hooks. Services use the shared API client. Pure filtering and pagination utilities can be tested independently.

Zustand contains client state such as selected routes, trips, search, status, page, and the selected vehicle ID. API responses remain in TanStack Query. A separate store instance is created per provider, preventing state from leaking between server requests.

Rendering is chosen per surface. The initial fleet is server-rendered on request. Filters, pagination, refreshing, and dialogs run as hydrated client interactions. Leaflet loads dynamically in the browser when needed. The field guide is statically generated because its explanations do not require a fresh vehicle feed.”

## 6:30–7:25 — Explain UI implementation, themes, and mobile UX

**Show:** `globals.css`, one colocated `.styles.ts` file, `TransitBusScene.tsx`, and the theme control. Switch Light, Dark, and System. Resize to 390 px. Demonstrate wrapped destinations and mobile pagination.

**Say:**

“The UI uses Tailwind CSS version four with semantic color tokens. Page and component class maps live beside their components in style files. Radix provides popup and dropdown interaction behavior, and Phosphor supplies icons.

The custom bus scene is SVG with CSS animation for the wheels, road, doors, and boarding sequence. It has Pause and Play controls and respects reduced-motion preferences. It is labelled as an illustration so users do not confuse it with live telemetry.

The theme defaults to the operating system preference. Light and Dark overrides persist across visits and navigation.

On mobile, destinations wrap, touch controls have larger targets, active filters can be removed individually, and the dropdown fits the available screen height.”

## 7:25–8:15 — Validation and error-state evidence

**Show:** The actual latest `npm test` output, production build route table, `docs/pdf-audit.md`, and `docs/ux-review.md`.

**Say:**

“The unit tests cover filtering, pagination, store transitions, request isolation, JSON:API normalization, and API errors. The latest terminal result shown here is the result I ran for this recording.

The repository also includes browser tests and documented responsive audits. Controlled fixtures cover slow requests, rate limits, detail errors, empty data, malformed responses, missing coordinates, and a fleet that shrinks during refresh.

The usability review checked narrow mobile, tablet, and desktop widths in both themes. It identified improvements such as returning focus to the originating card, preserving page size when clearing filters, and keeping searched dropdown options visible.

The audit documents the tested browser and viewport limits rather than claiming universal device coverage.”

## 8:15–9:00 — SEO, GEO, AEO, and delivery

**Show:** Field guide, metadata files, `src/shared/seo/index.ts`, and public repo README. Finish on the application.

**Say:**

“The application includes page metadata, canonical URLs, Open Graph sharing metadata, a sitemap, and robots rules. The static guide provides source links and answers to practical questions about filters, timestamps, and statuses.

Structured data describes the application, FAQ content, and breadcrumbs. The FAQ schema comes from the same content displayed on the page. These choices make the content easier for search and answer systems to interpret, but they do not guarantee rankings or AI citations.

Before deployment, the public site origin must be configured so canonical and sitemap URLs point to the real domain.

The public GitHub repository includes the source, lockfile, setup instructions, architecture explanation, tests, and audit documents. This completes my walkthrough of Transit Desk. Thank you.”

## 9:00–9:30 — Timing buffer

Use this buffer for slower API responses, scrolling, or one brief follow-up explanation. If the recording is already near nine minutes, finish at the end of the previous section.

## Main application flow checklist

1. Open overview and confirm the feed sync timestamp.
2. Read a vehicle card’s label, status, coordinates, and source timestamp.
3. Search by a visible label or destination.
4. Select multiple routes; scroll to load additional options.
5. Select multiple trips, explaining that scheduled trips can return no vehicles.
6. Remove a filter chip; show that changing routes clears trip selections.
7. Use page navigation and page-size selection.
8. Open Details; inspect route, trip, map, and full timestamp.
9. Close details and continue from the same card.
10. Switch appearance, inspect mobile controls, then return to System.
11. Show an empty result and reset filters.
12. Open the guide and return to the fleet.

## Optional controlled failure demonstration

Replace part of the validation segment if time permits. Keep the complete video below ten minutes.

```bash
# Terminal 1
node tests/support/fixture-server.mjs

# Terminal 2
TRANSIT_QA=1 TRANSIT_TEST_API_ORIGIN=http://127.0.0.1:4319 npm run dev -- --port 3002
```

Open the fixture control at `http://127.0.0.1:4319/__control` and the isolated app at `http://127.0.0.1:3002`.

Say: “This is the local fixture environment, so I can demonstrate a failure reproducibly.” Select `vehicles-error`, click Refresh feed, and show the retained cards and retry message. Select `normal`, click Try again, and show recovery. For loading indicators, choose `slow` and open a previously uncached vehicle or dropdown. Stop both fixture processes afterward.

Do not present fixture counts or coordinates as live MBTA data.

## Assessment coverage in the recording

| Required explanation            | Video section                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| Methods used to retrieve data   | 3:25–5:25: fetch, API gateway, relationships, cancellation, Query cache and refresh              |
| UI technologies                 | 6:30–7:25: Tailwind, tokens, colocated styles, Radix, icons, SVG/CSS                             |
| Pagination implementation       | 2:40–3:25 and 3:25–4:35: pure client-side pagination after combined filtering                    |
| Application functionality       | 0:40–3:25: cards, filter dropdowns, lazy loading, multiple selections, pagination, popup and map |
| Architecture and code structure | 5:25–6:30: feature modules, barrels, services, hooks, state separation, SSR/CSR/SSG              |
| Loading and errors              | 4:35–5:25 plus controlled failure demonstration if time permits                                  |
| Public source and README        | Opening and closing segments                                                                     |
