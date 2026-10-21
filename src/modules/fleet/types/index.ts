export interface IResource<T> {
  id: string;
  type: string;
  attributes: T;
  relationships?: Record<string, { data: { id: string; type: string } | null }>;
}
export interface IJsonApiResponse<T> {
  data: T;
  included?: IResource<Record<string, unknown>>[];
  links?: { next?: string | null; last?: string | null };
}
export interface IVehicleAttributes {
  label: string | null;
  current_status: string;
  latitude: number | null;
  longitude: number | null;
  updated_at: string;
  bearing: number | null;
  speed: number | null;
  occupancy_status: string | null;
  direction_id: number | null;
  current_stop_sequence: number | null;
}
export interface IVehicle extends IVehicleAttributes {
  id: string;
  routeId: string | null;
  routeName: string;
  routeLabel: string;
  routeType: number | null;
  tripId: string | null;
  tripName: string;
  headsign: string;
  stopName: string;
  direction: string;
}
export interface IFleetSnapshot {
  vehicles: IVehicle[];
  fetchedAt: string;
}
export interface IFilterOption {
  id: string;
  label: string;
  description: string;
}
export interface IOptionPage {
  options: IFilterOption[];
  next: string | undefined;
}
export type VehicleStatusFilter = 'all' | 'IN_TRANSIT_TO' | 'STOPPED_AT' | 'INCOMING_AT';
export interface IFleetFilters {
  routeIds: string[];
  tripIds: string[];
  search: string;
  status: VehicleStatusFilter;
}
