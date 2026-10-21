# Assessment coverage

Source: the user-provided `Tes Teknis Frontend.pdf`, pages 1–3. Document submission instructions are tracked separately from the user's project-building request.

| Requirement                                    | Implementation                                                   | Verification                                      |
| ---------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| React functional components and hooks          | Next.js App Router with React and TypeScript                     | Production build and type checking                |
| REST vehicle data                              | Typed MBTA client, server gateway, fleet service                 | Real `/vehicles` response and SSR HTML            |
| Vehicle cards                                  | Label, status, latitude/longitude, timestamp                     | Browser tests and desktop/mobile screenshots      |
| Pagination range, size, page count, navigation | Pure pagination utility and UI controls                          | Unit and browser tests, empty and last-page cases |
| Route and trip API dropdowns                   | Separate lazy queries, 25 options per page                       | Real API smoke check                              |
| Multi-select routes and trips                  | OR within categories, AND across categories                      | Unit and browser tests                            |
| Infinite scrolling / lazy loading              | IntersectionObserver and Load more                               | Browser tests and option pagination               |
| Vehicle detail popup                           | Fresh detail query, accessible Radix dialog                      | Browser tests                                     |
| Detail fields and route/trip                   | Normalized included relationships                                | Live detail smoke check                           |
| Bonus map                                      | Lazy Leaflet map, OpenStreetMap attribution                      | Browser map check and screenshot                  |
| Loading indicators                             | SSR loading boundary, cards, dropdowns, detail and map skeletons | Browser tests and code inspection                 |
| Friendly errors                                | Timeouts, API status messages, retry, stale-data banner          | Failed-refresh browser test                       |
| Bonus TypeScript                               | Strict typed API and UI contracts                                | Type checking                                     |
| Tailwind                                       | Tailwind v4 via PostCSS and semantic tokens                      | Production stylesheet and visual inspection       |
| README                                         | Setup, environment, architecture and tradeoffs                   | Included at project root                          |
| Public GitHub repository                       | Not published by this task                                       | Separate publication step                         |
| 5–10 minute video                              | Demo outline provided                                            | Recording/submission remains separate             |
| Full Next.js SSR + CSR + SSG                   | SSR fleet, CSR interactions/map, SSG guide                       | Build route classification and HTML inspection    |
| SEO/GEO/AEO                                    | Metadata, sitemap, robots, schemas, sourced answers              | Metadata and crawler-route tests                  |

All functions, file names, interface names, UI copy, and project documentation are English. The Indonesian original brief remains the requirement source, not an instruction to perform external publication.

The latest full audit is recorded in [pdf-audit.md](pdf-audit.md), with browser evidence in `audit-results.json`. Earlier validation notes are historical.
