# Fleet module

Owns `/`: network summary, vehicle cards, search, status, route/trip filters, pagination, and vehicle detail popup.

Data dependencies: `/vehicles?include=route,trip`, `/vehicles/:id?include=route,trip,stop`, `/routes`, and `/trips`. Services normalize JSON:API responses. Query hooks own remote state. A per-provider Zustand store owns UI state only.

Cross-module consumers use `index.ts`. Page-only components and styles remain in `pages/fleet-overview`. The public `getFleetSnapshot` service is used by the server route to produce initial HTML.
