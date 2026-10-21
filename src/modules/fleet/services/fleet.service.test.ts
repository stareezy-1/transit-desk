import { afterEach, expect, it, vi } from 'vitest';
import { getFleetSnapshot, getFilterOptions, mapVehicle } from './fleet.service';
import { apiRequest, toApiPath } from '@/shared/api-client';
import type { IVehicleAttributes } from '../types';
vi.mock('@/shared/api-client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/api-client')>()),
  apiRequest: vi.fn(),
}));
afterEach(() => vi.clearAllMocks());
it('follows API next links and deduplicates a changing feed', async () => {
  const item = { id: 'v1', type: 'vehicle', attributes: { label: '101' } as IVehicleAttributes };
  vi.mocked(apiRequest)
    .mockResolvedValueOnce({
      data: [item],
      links: { next: 'https://api-v3.mbta.com/vehicles?page[offset]=1' },
    })
    .mockResolvedValueOnce({ data: [item, { ...item, id: 'v2' }] });
  const result = await getFleetSnapshot();
  expect(result.vehicles.map((v) => v.id)).toEqual(['v1', 'v2']);
  expect(apiRequest).toHaveBeenCalledTimes(2);
});
it('always gives the trips endpoint its required filter and follows lazy-load links', async () => {
  vi.mocked(apiRequest).mockResolvedValue({
    data: [],
    links: { next: 'https://api-v3.mbta.com/trips?page[offset]=25' },
  });
  const result = await getFilterOptions('trips', []);
  const path = vi.mocked(apiRequest).mock.calls[0][0];
  expect(new URL(path, 'https://api-v3.mbta.com').searchParams.has('filter[revenue]')).toBe(true);
  expect(result.next).toBe('/trips?page[offset]=25');
});
it('maps missing relationships without crashing', () => {
  expect(
    mapVehicle({ id: 'v1', type: 'vehicle', attributes: { label: null } as IVehicleAttributes }),
  ).toMatchObject({
    routeName: 'Unassigned route',
    tripId: null,
    headsign: 'Destination unavailable',
  });
});
it('rejects pagination links to a foreign origin', () => {
  expect(() => toApiPath('https://untrusted.example/vehicles')).toThrow('invalid page link');
});
it('rejects malformed list envelopes with an actionable message', async () => {
  vi.mocked(apiRequest).mockResolvedValue({ data: null });
  await expect(getFleetSnapshot()).rejects.toThrow('Vehicle data is temporarily unavailable');
  await expect(getFilterOptions('routes', [])).rejects.toThrow(
    'Filter options are temporarily unavailable',
  );
});
