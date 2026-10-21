import { XIcon } from '@phosphor-icons/react';
import type { IVehicle } from '../../../types';
import { styles as s } from './SelectedFilters.styles';
interface ISelectedFiltersProps {
  routeIds: string[];
  tripIds: string[];
  vehicles?: IVehicle[];
  onRoutesChange: (ids: string[]) => void;
  onTripsChange: (ids: string[]) => void;
}
export function SelectedFilters({
  routeIds,
  tripIds,
  vehicles,
  onRoutesChange,
  onTripsChange,
}: ISelectedFiltersProps) {
  if (!routeIds.length && !tripIds.length) return null;
  function restoreFilterFocus(kind: 'routes' | 'trips') {
    document.getElementById(`filter-${kind}-trigger`)?.focus({ preventScroll: true });
  }
  return (
    <div className={s.panel}>
      <div className={s.chips} role="group" aria-label="Active filters">
        {routeIds.map((id) => {
          const vehicle = vehicles?.find((item) => item.routeId === id);
          return (
            <button
              key={`route-${id}`}
              className={s.chip}
              aria-label={`Remove route ${id}`}
              onClick={() => {
                onRoutesChange(routeIds.filter((value) => value !== id));
                restoreFilterFocus('routes');
              }}
            >
              <span className={s.label}>Route {vehicle?.routeLabel || id}</span>
              <XIcon size={14} className={s.icon} />
            </button>
          );
        })}
        {tripIds.map((id) => (
          <button
            key={`trip-${id}`}
            className={s.chip}
            aria-label={`Remove trip ${id}`}
            onClick={() => {
              onTripsChange(tripIds.filter((value) => value !== id));
              restoreFilterFocus('trips');
            }}
          >
            <span className={s.label}>Trip {id}</span>
            <XIcon size={14} className={s.icon} />
          </button>
        ))}
      </div>
      {tripIds.length > 0 && <p className={s.hint}>Changing routes clears your selected trips.</p>}
    </div>
  );
}
