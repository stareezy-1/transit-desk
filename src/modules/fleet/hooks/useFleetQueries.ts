import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getFilterOptions, getFleetSnapshot, getVehicle } from '../services/fleet.service';
import type { IFleetSnapshot } from '../types';
export const fleetKeys = {
  all: ['fleet'] as const,
  snapshot: () => ['fleet', 'snapshot'] as const,
  detail: (id: string) => ['fleet', 'detail', id] as const,
  options: (kind: string, routes: string[]) =>
    ['fleet', 'options', kind, [...routes].sort()] as const,
};
export function useFleetSnapshot(initialData?: IFleetSnapshot) {
  return useQuery({
    queryKey: fleetKeys.snapshot(),
    queryFn: ({ signal }) => getFleetSnapshot(signal),
    initialData,
    initialDataUpdatedAt: initialData ? new Date(initialData.fetchedAt).getTime() : undefined,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
}
export function useVehicle(id: string) {
  return useQuery({
    queryKey: fleetKeys.detail(id),
    queryFn: ({ signal }) => getVehicle(id, signal),
    staleTime: 10_000,
  });
}
export function useFilterOptions(kind: 'routes' | 'trips', routeIds: string[], enabled: boolean) {
  return useInfiniteQuery({
    queryKey: fleetKeys.options(kind, kind === 'trips' ? routeIds : []),
    queryFn: ({ pageParam, signal }) => getFilterOptions(kind, routeIds, pageParam, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.next,
    enabled,
    staleTime: 5 * 60_000,
  });
}
