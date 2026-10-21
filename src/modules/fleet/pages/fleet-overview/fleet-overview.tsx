'use client';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import {
  ArrowUpRightIcon,
  BroadcastIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  PathIcon,
  WarningCircleIcon,
  XIcon,
} from '@phosphor-icons/react';
import { ThemeControl } from '@/shared/theme';
import { cn } from '@/shared/utils';
import { useFleetSnapshot } from '../../hooks/useFleetQueries';
import { FleetStoreProvider, useFleetUiStore } from '../../stores/fleet.store';
import type { IFleetSnapshot, VehicleStatusFilter } from '../../types';
import { filterVehicles, formatTimestamp, paginate } from '../../utils/vehicles';
import { FilterDropdown } from './components/FilterDropdown';
import { SelectedFilters } from './components/SelectedFilters';
import { VehicleCard } from './components/VehicleCard';
import { FleetHero } from './components/FleetHero';
import { FleetSummary } from './components/FleetSummary';
import { FleetPagination } from './components/FleetPagination';
import { VehicleDetail } from './components/VehicleDetail';
import { styles as s } from './fleet-overview.styles';
const STATUS_TABS: { value: VehicleStatusFilter; label: string }[] = [
  { value: 'all', label: 'All vehicles' },
  { value: 'IN_TRANSIT_TO', label: 'In transit' },
  { value: 'STOPPED_AT', label: 'At stop' },
  { value: 'INCOMING_AT', label: 'Arriving' },
];
export function FleetOverviewPage({ initialData }: { initialData?: IFleetSnapshot }) {
  return (
    <FleetStoreProvider>
      <FleetOverview initialData={initialData} />
    </FleetStoreProvider>
  );
}
function FleetOverview({ initialData }: { initialData?: IFleetSnapshot }) {
  const query = useFleetSnapshot(initialData);
  const routeIds = useFleetUiStore((state) => state.routeIds);
  const tripIds = useFleetUiStore((state) => state.tripIds);
  const search = useFleetUiStore((state) => state.search);
  const status = useFleetUiStore((state) => state.status);
  const page = useFleetUiStore((state) => state.page);
  const pageSize = useFleetUiStore((state) => state.pageSize);
  const selectedId = useFleetUiStore((state) => state.selectedVehicleId);
  const actions = useFleetUiStore((state) => state.actions);
  const vehicles = query.data?.vehicles;
  const filtered = useMemo(
    () => filterVehicles(vehicles ?? [], { routeIds, tripIds, search, status }),
    [vehicles, routeIds, tripIds, search, status],
  );
  const pagination = paginate(filtered, page, pageSize);
  useEffect(() => {
    if (vehicles && page !== pagination.page) actions.setPage(pagination.page);
  }, [vehicles, page, pagination.page, actions]);
  function revealResults() {
    const heading = document.getElementById('fleet-title');
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  function changePage(nextPage: number) {
    actions.setPage(nextPage);
    revealResults();
  }
  function changePageSize(size: number) {
    actions.setPageSize(size);
    revealResults();
  }
  const hasFilters = Boolean(routeIds.length || tripIds.length || search || status !== 'all');
  return (
    <div className={s.shell}>
      <header className={s.topbar}>
        <div className={s.topbarInner}>
          <Link href="/" className={s.brand} aria-label="Transit Desk home">
            <span className={s.brandIcon}>
              <PathIcon size={25} weight="bold" />
            </span>
            <span>
              Transit<span className={s.brandDot}>/ desk</span>
            </span>
          </Link>
          <nav className={s.nav} aria-label="Main navigation">
            <Link href="/" className={s.navActive} aria-current="page" aria-label="Fleet overview">
              <span className={s.navFull}>Fleet overview</span>
              <span className={s.navCompact}>Fleet</span>
            </Link>
            <Link href="/guide" className={s.navLink} aria-label="Field guide">
              <span className={s.navFull}>Field guide</span>
              <span className={s.navCompact}>Guide</span>
              <ArrowUpRightIcon size={12} className="inline-icon" />
            </Link>

            <ThemeControl />
            <span className={s.network}>
              <span className={s.liveDot} />
              MBTA network
            </span>
          </nav>
        </div>
      </header>
      <main id="main-content" className={s.main}>
        <FleetHero refreshing={query.isFetching} onRefresh={() => void query.refetch()} />
        <FleetSummary vehicles={vehicles} isError={query.isError} />
        <section id="fleet" aria-labelledby="fleet-title" className="fleet-section">
          <div className={s.sectionHeader}>
            <div>
              <p className={s.sectionMarker}>The latest from the street</p>
              <h2 className={s.sectionTitle} id="fleet-title" tabIndex={-1}>
                The fleet{vehicles && <span className={s.count}>{filtered.length}</span>}
              </h2>
            </div>
            <p className={s.sync}>
              <BroadcastIcon size={13} />
              {query.isFetching
                ? 'Updating snapshot…'
                : query.data
                  ? `Synced ${formatTimestamp(query.data.fetchedAt)}`
                  : 'Connecting to MBTA…'}
            </p>
          </div>
          <div className={s.filters}>
            <div className={s.searchWrap}>
              <MagnifyingGlassIcon size={18} className={s.searchIcon} />
              <input
                className={s.search}
                id="vehicle-search"
                aria-label="Search vehicles"
                autoComplete="off"
                placeholder="Search vehicle, route, or destination…"
                value={search}
                onChange={(event) => actions.setSearch(event.target.value)}
              />
            </div>
            <FilterDropdown
              kind="routes"
              selected={routeIds}
              routeIds={routeIds}
              onChange={actions.setRoutes}
            />
            <FilterDropdown
              kind="trips"
              selected={tripIds}
              routeIds={routeIds}
              onChange={actions.setTrips}
            />
            <button className={s.reset} disabled={!hasFilters} onClick={actions.clearFilters}>
              <XIcon size={14} />
              Reset
            </button>
          </div>
          <SelectedFilters
            routeIds={routeIds}
            tripIds={tripIds}
            vehicles={vehicles}
            onRoutesChange={actions.setRoutes}
            onTripsChange={actions.setTrips}
          />
          <div className={s.toolbar}>
            <div className={s.tabs} aria-label="Vehicle status">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  className={cn(s.tab, status === tab.value && s.tabActive)}
                  aria-pressed={status === tab.value}
                  onClick={() => actions.setStatus(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <p className={s.toolbarNote}>Auto-refresh every 30 seconds · Times in Eastern Time</p>
          </div>
          {query.isError && (
            <div className={s.error} role="alert">
              <span className={s.errorCopy}>
                <WarningCircleIcon size={20} />
                {query.error.message}
                {query.data ? ' Showing the last successful snapshot.' : ''}
              </span>
              <button className={s.retry} onClick={() => void query.refetch()}>
                Try again
              </button>
            </div>
          )}
          {query.isPending ? (
            <div className={s.grid} role="status" aria-label="Loading vehicles">
              {Array.from({ length: pageSize }, (_, index) => (
                <div key={index} className={s.skeleton}>
                  <div className={s.skeletonShort} />
                  <div className={s.skeletonLong} />
                  <div className={s.skeletonBlock} />
                </div>
              ))}
            </div>
          ) : (
            vehicles &&
            (pagination.items.length ? (
              <div className={s.grid} aria-busy={query.isFetching}>
                {pagination.items.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onSelect={actions.selectVehicle}
                  />
                ))}
              </div>
            ) : (
              <div className={s.empty}>
                <FunnelSimpleIcon size={32} className={s.emptyIcon} />
                <h3 className={s.emptyTitle}>
                  {hasFilters
                    ? 'No vehicles match this view'
                    : 'No vehicles are reporting right now'}
                </h3>
                <p className={s.emptyText}>
                  {hasFilters
                    ? 'Try another route or trip, or reset your filters to explore the full fleet.'
                    : 'No vehicles are currently reporting. Refresh the feed to check again.'}
                </p>
                <button
                  className={s.refresh}
                  onClick={() => (hasFilters ? actions.clearFilters() : void query.refetch())}
                >
                  {hasFilters ? 'Reset filters' : 'Refresh feed'}
                </button>
              </div>
            ))
          )}
          {vehicles && (
            <FleetPagination
              pagination={pagination}
              pageSize={pageSize}
              onPageChange={changePage}
              onPageSizeChange={changePageSize}
            />
          )}
        </section>
        <footer className={s.footer}>
          <div className={s.footerTop}>
            <p>
              Last reported positions. New snapshots every 30 seconds.{' '}
              <Link href="/guide" className={s.footerLink}>
                How this dashboard works
              </Link>
            </p>
            <p>
              Data from{' '}
              <a className={s.footerLink} href="https://www.mbta.com/developers/v3-api">
                MBTA V3 API
              </a>{' '}
              · Independent assessment project
            </p>
          </div>
          <p className={s.footerWord} aria-hidden="true">
            Transit / desk
          </p>
        </footer>
      </main>
      {selectedId && <VehicleDetail id={selectedId} onClose={() => actions.selectVehicle(null)} />}
    </div>
  );
}
