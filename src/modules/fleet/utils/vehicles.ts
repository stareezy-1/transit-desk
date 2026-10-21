import type { IFleetFilters, IVehicle } from '../types';
export function filterVehicles(vehicles: IVehicle[], filters: IFleetFilters) {
  const search = filters.search.trim().toLowerCase();
  return vehicles.filter(
    (vehicle) =>
      (!filters.routeIds.length || filters.routeIds.includes(vehicle.routeId ?? '')) &&
      (!filters.tripIds.length || filters.tripIds.includes(vehicle.tripId ?? '')) &&
      (filters.status === 'all' || vehicle.current_status === filters.status) &&
      (!search ||
        [vehicle.label, vehicle.id, vehicle.routeName, vehicle.routeLabel, vehicle.headsign].some(
          (value) => value?.toLowerCase().includes(search),
        )),
  );
}
export function paginate<T>(items: T[], requestedPage: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.max(1, Math.min(requestedPage, totalPages));
  const start = items.length ? (page - 1) * pageSize + 1 : 0;
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    totalPages,
    start,
    end: Math.min(page * pageSize, items.length),
    total: items.length,
  };
}
export function statusLabel(status: string) {
  return (
    (
      { IN_TRANSIT_TO: 'In transit', STOPPED_AT: 'At stop', INCOMING_AT: 'Arriving' } as Record<
        string,
        string
      >
    )[status] ?? 'Status unavailable'
  );
}
export function formatTimestamp(value: string, full = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Time unavailable';
  return (
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/New_York',
      ...(full ? ({ month: 'short', day: 'numeric', year: 'numeric' } as const) : {}),
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date) + ' ET'
  );
}
export function formatCoordinate(value: number | null) {
  return value === null || !Number.isFinite(value) ? 'Unavailable' : value.toFixed(5);
}
export function hasCoordinates(vehicle: IVehicle) {
  return (
    vehicle.latitude !== null &&
    vehicle.longitude !== null &&
    Number.isFinite(vehicle.latitude) &&
    Number.isFinite(vehicle.longitude) &&
    Math.abs(vehicle.latitude) <= 90 &&
    Math.abs(vehicle.longitude) <= 180
  );
}
