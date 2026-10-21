import { describe, expect, it } from 'vitest';
import { filterVehicles, paginate, hasCoordinates, formatCoordinate } from './vehicles';
import type { IVehicle } from '../types';
const vehicles = [
  {
    id: 'a',
    label: '101',
    routeId: '1',
    tripId: 't1',
    current_status: 'IN_TRANSIT_TO',
    routeName: 'Harvard',
    routeLabel: '1',
    headsign: 'Central',
  },
  {
    id: 'b',
    label: '102',
    routeId: '1',
    tripId: 't2',
    current_status: 'STOPPED_AT',
    routeName: 'Harvard',
    routeLabel: '1',
    headsign: 'Central',
  },
  {
    id: 'c',
    label: '103',
    routeId: '2',
    tripId: 't3',
    current_status: 'INCOMING_AT',
    routeName: 'Downtown',
    routeLabel: '2',
    headsign: 'Station',
  },
] as IVehicle[];
const base = { routeIds: [], tripIds: [], search: '', status: 'all' as const };
describe('fleet filtering', () => {
  it('combines multiple values with OR and filter categories with AND', () => {
    expect(
      filterVehicles(vehicles, { ...base, routeIds: ['1', '2'], tripIds: ['t2', 't3'] }).map(
        (v) => v.id,
      ),
    ).toEqual(['b', 'c']);
    expect(filterVehicles(vehicles, { ...base, routeIds: ['1'], tripIds: ['t3'] })).toEqual([]);
  });
  it('combines status and case-insensitive trimmed search', () => {
    expect(
      filterVehicles(vehicles, { ...base, search: ' HARVARD ', status: 'STOPPED_AT' }).map(
        (v) => v.id,
      ),
    ).toEqual(['b']);
  });
});
describe('pagination', () => {
  it('reports exact range on the last partial page', () => {
    expect(paginate(vehicles, 2, 2)).toMatchObject({
      page: 2,
      totalPages: 2,
      start: 3,
      end: 3,
      total: 3,
      items: [vehicles[2]],
    });
  });
  it('clamps the page when refreshed data shrinks', () => {
    expect(paginate(vehicles.slice(0, 1), 9, 6)).toMatchObject({ page: 1, start: 1, end: 1 });
  });
  it('handles an empty result without negative ranges', () => {
    expect(paginate([], 5, 6)).toMatchObject({
      page: 1,
      totalPages: 1,
      start: 0,
      end: 0,
      total: 0,
    });
  });
});
it('accepts zero coordinates and rejects absent or invalid positions', () => {
  expect(hasCoordinates({ latitude: 0, longitude: 0 } as IVehicle)).toBe(true);
  expect(hasCoordinates({ latitude: null, longitude: -71 } as IVehicle)).toBe(false);
  expect(hasCoordinates({ latitude: 100, longitude: -71 } as IVehicle)).toBe(false);
  expect(formatCoordinate(null)).toBe('Unavailable');
});
