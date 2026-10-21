'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { createStore, useStore } from 'zustand';
import type { IFleetFilters, VehicleStatusFilter } from '../types';
export interface IFleetUiState extends IFleetFilters {
  page: number;
  pageSize: number;
  selectedVehicleId: string | null;
  actions: {
    setRoutes: (ids: string[]) => void;
    setTrips: (ids: string[]) => void;
    setSearch: (search: string) => void;
    setStatus: (status: VehicleStatusFilter) => void;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    selectVehicle: (id: string | null) => void;
    clearFilters: () => void;
    reset: () => void;
  };
}
const initialState = {
  routeIds: [],
  tripIds: [],
  search: '',
  status: 'all' as const,
  page: 1,
  pageSize: 6,
  selectedVehicleId: null,
};
export function createFleetStore() {
  return createStore<IFleetUiState>()((set) => ({
    ...initialState,
    actions: {
      setRoutes: (routeIds) => set({ routeIds, tripIds: [], page: 1 }),
      setTrips: (tripIds) => set({ tripIds, page: 1 }),
      setSearch: (search) => set({ search, page: 1 }),
      setStatus: (status) => set({ status, page: 1 }),
      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => set({ pageSize, page: 1 }),
      selectVehicle: (selectedVehicleId) => set({ selectedVehicleId }),
      clearFilters: () => set({ routeIds: [], tripIds: [], search: '', status: 'all', page: 1 }),
      reset: () => set({ ...initialState }),
    },
  }));
}
type FleetStore = ReturnType<typeof createFleetStore>;
export const FleetStoreContext = createContext<FleetStore | null>(null);
export function useFleetUiStore<T>(selector: (state: IFleetUiState) => T) {
  const store = useContext(FleetStoreContext);
  if (!store) throw new Error('Fleet store provider is missing.');
  return useStore(store, selector);
}
// A store per provider prevents state leaking between server requests.
export function FleetStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createFleetStore);
  return <FleetStoreContext.Provider value={store}>{children}</FleetStoreContext.Provider>;
}
