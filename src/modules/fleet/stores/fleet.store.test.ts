import { expect, it } from 'vitest';
import { createFleetStore } from './fleet.store';
it('resets trips and pagination after changing routes without retaining server entities', () => {
  const store = createFleetStore();
  store.getState().actions.setTrips(['t1']);
  store.getState().actions.setPage(5);
  store.getState().actions.setRoutes(['1', '2']);
  expect(store.getState()).toMatchObject({ routeIds: ['1', '2'], tripIds: [], page: 1 });
  store.getState().actions.setPageSize(12);
  store.getState().actions.reset();
  expect(store.getState()).toMatchObject({ routeIds: [], tripIds: [], pageSize: 6, page: 1 });
});
it('isolates state between server requests and mounted providers', () => {
  const a = createFleetStore();
  const b = createFleetStore();
  a.getState().actions.setSearch('101');
  expect(b.getState().search).toBe('');
});

it('clears filters without discarding the preferred page size', () => {
  const store = createFleetStore();
  store.getState().actions.setPageSize(24);
  store.getState().actions.setSearch('Harvard');
  store.getState().actions.setRoutes(['1']);
  store.getState().actions.setTrips(['t1']);
  store.getState().actions.setStatus('STOPPED_AT');
  store.getState().actions.clearFilters();
  expect(store.getState()).toMatchObject({
    pageSize: 24,
    page: 1,
    search: '',
    routeIds: [],
    tripIds: [],
    status: 'all',
  });
});
