import { apiRequest, toApiPath, ApiError } from '@/shared/api-client';
import type {
  IFleetSnapshot,
  IJsonApiResponse,
  IResource,
  IVehicle,
  IVehicleAttributes,
  IOptionPage,
} from '../types';
function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value ? value : fallback;
}
export function mapVehicle(
  resource: IResource<IVehicleAttributes>,
  included: IResource<Record<string, unknown>>[] = [],
): IVehicle {
  const related = (type: string) =>
    included.find(
      (item) => item.type === type && item.id === resource.relationships?.[type]?.data?.id,
    )?.attributes;
  const route = related('route');
  const trip = related('trip');
  const stop = related('stop');
  const routeId = resource.relationships?.route?.data?.id ?? null;
  const tripId = resource.relationships?.trip?.data?.id ?? null;
  const directions = route?.direction_names;
  return {
    ...resource.attributes,
    id: resource.id,
    routeId,
    tripId,
    routeName: text(route?.long_name, 'Unassigned route'),
    routeLabel: text(route?.short_name, routeId ?? '—'),
    routeType: typeof route?.type === 'number' ? route.type : null,
    tripName: text(trip?.name, tripId ?? 'Unassigned'),
    headsign: text(trip?.headsign, 'Destination unavailable'),
    stopName: text(stop?.name, 'Stop unavailable'),
    direction:
      Array.isArray(directions) && resource.attributes.direction_id !== null
        ? text(directions[resource.attributes.direction_id], 'Unknown direction')
        : 'Unknown direction',
  };
}
export async function getFleetSnapshot(signal?: AbortSignal): Promise<IFleetSnapshot> {
  const vehicles = new Map<string, IVehicle>();
  let path: string | undefined = '/vehicles?include=route,trip&page[limit]=1000&sort=id';
  const visited = new Set<string>();
  while (path) {
    if (visited.has(path))
      throw new Error('The transit feed returned a repeated page. Please retry.');
    visited.add(path);
    const result: IJsonApiResponse<IResource<IVehicleAttributes>[]> = await apiRequest(
      path,
      signal,
    );
    if (!Array.isArray(result.data))
      throw new ApiError('Vehicle data is temporarily unavailable. Please try again.', 502);
    for (const resource of result.data)
      vehicles.set(resource.id, mapVehicle(resource, result.included));
    path = result.links?.next ? toApiPath(result.links.next) : undefined;
  }
  return { vehicles: [...vehicles.values()], fetchedAt: new Date().toISOString() };
}
export async function getVehicle(id: string, signal?: AbortSignal) {
  const result = await apiRequest<IJsonApiResponse<IResource<IVehicleAttributes>>>(
    `/vehicles/${encodeURIComponent(id)}?include=route,trip,stop`,
    signal,
  );
  if (!result.data?.attributes)
    throw new ApiError('Vehicle details are temporarily unavailable. Please try again.', 502);
  return mapVehicle(result.data, result.included);
}
export async function getFilterOptions(
  kind: 'routes' | 'trips',
  routeIds: string[],
  pagePath?: string,
  signal?: AbortSignal,
): Promise<IOptionPage> {
  const params = new URLSearchParams({
    'page[limit]': '25',
    sort: kind === 'routes' ? 'sort_order' : 'id',
  });
  if (kind === 'trips') {
    params.set('filter[revenue]', 'REVENUE');
    if (routeIds.length) params.set('filter[route]', routeIds.join(','));
  }
  const result = await apiRequest<IJsonApiResponse<IResource<Record<string, unknown>>[]>>(
    pagePath ?? `/${kind}?${params}`,
    signal,
  );
  if (!Array.isArray(result.data))
    throw new ApiError('Filter options are temporarily unavailable. Please try again.', 502);
  return {
    options: result.data.map((item) => ({
      id: item.id,
      label:
        kind === 'routes'
          ? text(item.attributes.short_name, text(item.attributes.long_name, item.id))
          : text(item.attributes.headsign, item.id),
      description: kind === 'routes' ? text(item.attributes.long_name, item.id) : `Trip ${item.id}`,
    })),
    next: result.links?.next ? toApiPath(result.links.next) : undefined,
  };
}
