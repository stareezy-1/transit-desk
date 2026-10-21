# User-experience review

Reviewed on 15 October 2026 using the **web-design-guidelines** skill, focusing on real task completion rather than visual novelty. The architecture-oriented design-reviewer skill was inspected; its architectural workflow was outside this interaction review's scope.

## Findings resolved

- `src/modules/fleet/pages/fleet-overview/components/VehicleDetail.tsx:34` — **[CP-05 / A11Y-03]** Closing details now returns focus to the vehicle button that opened them. If that vehicle leaves the current result set, focus falls back to the fleet heading.
- `src/modules/fleet/pages/fleet-overview/fleet-overview.tsx:59` — **[A11Y-03]** A page or page-size change brings the new results into view and moves keyboard focus to their heading. Users no longer remain below the replacement cards.
- `src/modules/fleet/pages/fleet-overview/components/SelectedFilters.tsx:11` — **[CP-01]** Active routes and trips are visible as individually removable controls. Removing a control restores focus to its corresponding dropdown. A visible note explains that route changes clear trip selections.
- `src/modules/fleet/stores/fleet.store.tsx:41` — **[CP-01]** Clearing filters preserves the preferred page size. Full store reset remains separate for lifecycle/reset use.
- `src/modules/fleet/pages/fleet-overview/components/FleetPagination.tsx:62` — **[RD-01]** Small screens use a direct page selector between Previous and Next rather than a wrapped row of page buttons.
- `src/modules/fleet/pages/fleet-overview/components/FleetPagination.styles.ts:10` — **[RD-01]** Pagination, modal close, dropdown footer, theme, status, and animation controls have 44px touch heights; primary icon controls also have 44px widths.
- `src/modules/fleet/pages/fleet-overview/components/VehicleCard.styles.ts:10` — **[I18N-01 / RD-01]** Mobile cards place the destination on its own row and wrap long route/destination names instead of truncating useful information.
- `src/modules/fleet/pages/fleet-overview/components/FilterDropdown.tsx:57` — **[CP-04]** Dropdown search explains that it covers loaded options and offers Load more when additional matches may exist. A searched result is scrolled back into view after additional pages arrive.
- `src/modules/fleet/pages/fleet-overview/components/FilterDropdown.tsx:91` — **[RD-01]** Dropdown height respects available viewport space. Coarse-pointer devices focus the options area instead of automatically opening the virtual keyboard. Secondary help is collapsed in short viewports to keep choices and Done usable.
- `src/shared/theme/ThemeControl.styles.ts:5` — **[RD-01]** Native mobile inputs/selects use 16px text and larger hit areas. Header branding and navigation reflow at 320px.

## Verification

The focused UX flow passed at **320, 390, 768, and 1440 CSS pixels**, in both Light and Dark modes: **eight combinations**. Checks covered:

- No horizontal page overflow on the fleet page or guide.
- New results are visible and focused after pagination.
- Mobile direct page selection.
- Modal focus returns to the correct card.
- Active route/trip selection, individual removal, and focus recovery.
- Measured 44px bounds for pagination, modal close, and dropdown Done controls.
- Navigation to and from the guide.

A separate **390 × 500** viewport check found a partially clipped search result. The dropdown now removes secondary footnotes in that constrained space and resets the searched result's scroll position. The entire matching option was confirmed inside the scroll viewport. A browser check also confirmed that Reset retained the selected 24-row page size.

The updated unit suite has **20 passing tests**, including the page-size preservation regression. Production build and TypeScript checks passed. Evidence is saved in `ux-results.json`.

## Practical limits

These are responsive Chromium and keyboard checks, not an observation study with real users or a formal accessibility certification. Real-device virtual keyboard behavior and assistive-technology output were not directly tested. The coarse-pointer keyboard behavior was reviewed in source. Existing reduced-motion and system-theme behavior remains in place. The earlier full PDF audit is preserved in `pdf-audit.md`; this review adds interaction improvements without changing the API contract.
