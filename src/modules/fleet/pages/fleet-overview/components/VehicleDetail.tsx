import dynamic from 'next/dynamic';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRightIcon, XIcon } from '@phosphor-icons/react';
import { useVehicle } from '../../../hooks/useFleetQueries';
import {
  formatCoordinate,
  formatTimestamp,
  hasCoordinates,
  statusLabel,
} from '../../../utils/vehicles';
import { styles as s } from './VehicleDetail.styles';
const VehicleMap = dynamic(() => import('./VehicleMap'), {
  ssr: false,
  loading: () => (
    <div className={s.mapLoading} role="status">
      Loading map…
    </div>
  ),
});
export function VehicleDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const query = useVehicle(id);
  const vehicle = query.data;
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />
        <Dialog.Content
          className={s.content}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const trigger = document.getElementById(`vehicle-trigger-${id}`);
            if (trigger) trigger.focus({ preventScroll: true });
            else document.getElementById('fleet-title')?.focus();
          }}
        >
          <div className={s.header}>
            <div>
              <p className={s.eyebrow}>Fleet / Vehicle details</p>
              <Dialog.Title className={s.title}>Vehicle {vehicle?.label || id}</Dialog.Title>
              <Dialog.Description className={s.description}>
                Current position, route, and trip from the MBTA feed.
              </Dialog.Description>
            </div>
            <Dialog.Close className={s.close} aria-label="Close vehicle details">
              <XIcon size={18} />
            </Dialog.Close>
          </div>
          {query.isPending && (
            <div className={s.skeleton} role="status" aria-label="Loading vehicle details" />
          )}
          {query.isFetching && !query.isPending && (
            <p role="status" className={s.description}>
              Updating vehicle details…
            </p>
          )}
          {query.isError && (
            <div className={s.error} role="alert">
              {query.error.message}
              <button className={s.retry} onClick={() => void query.refetch()}>
                Try again
              </button>
            </div>
          )}
          {vehicle && (
            <>
              {hasCoordinates(vehicle) ? (
                <VehicleMap
                  latitude={vehicle.latitude!}
                  longitude={vehicle.longitude!}
                  label={vehicle.label || id}
                />
              ) : (
                <div className={s.mapEmpty}>Position is unavailable for this vehicle.</div>
              )}
              <dl className={s.facts}>
                <div>
                  <dt className={s.label}>Status</dt>
                  <dd className={s.value}>{statusLabel(vehicle.current_status)}</dd>
                </div>
                <div>
                  <dt className={s.label}>Route</dt>
                  <dd className={s.value}>
                    {vehicle.routeLabel} · {vehicle.routeName}
                  </dd>
                </div>
                <div>
                  <dt className={s.label}>Destination</dt>
                  <dd className={s.value}>{vehicle.headsign}</dd>
                </div>
                <div>
                  <dt className={s.label}>Latitude</dt>
                  <dd className={s.mono}>{formatCoordinate(vehicle.latitude)}</dd>
                </div>
                <div>
                  <dt className={s.label}>Longitude</dt>
                  <dd className={s.mono}>{formatCoordinate(vehicle.longitude)}</dd>
                </div>
                <div>
                  <dt className={s.label}>Direction</dt>
                  <dd className={s.value}>{vehicle.direction}</dd>
                </div>
                <div>
                  <dt className={s.label}>Trip</dt>
                  <dd className={s.mono}>{vehicle.tripId ?? 'Unassigned'}</dd>
                </div>
                <div>
                  <dt className={s.label}>Current / next stop</dt>
                  <dd className={s.value}>{vehicle.stopName}</dd>
                </div>
                <div>
                  <dt className={s.label}>Occupancy</dt>
                  <dd className={s.value}>
                    {vehicle.occupancy_status?.toLowerCase().replaceAll('_', ' ') ?? 'Not reported'}
                  </dd>
                </div>
                <div>
                  <dt className={s.label}>Speed</dt>
                  <dd className={s.mono}>
                    {vehicle.speed === null
                      ? 'Not reported'
                      : `${(vehicle.speed * 3.6).toFixed(1)} km/h`}
                  </dd>
                </div>
                <div>
                  <dt className={s.label}>Last update</dt>
                  <dd className={s.mono}>
                    <time dateTime={vehicle.updated_at}>
                      {formatTimestamp(vehicle.updated_at, true)}
                    </time>
                  </dd>
                </div>
              </dl>
              {hasCoordinates(vehicle) && (
                <a
                  className={s.mapLink}
                  href={`https://www.openstreetmap.org/?mlat=${vehicle.latitude}&mlon=${vehicle.longitude}#map=15/${vehicle.latitude}/${vehicle.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in OpenStreetMap
                  <ArrowUpRightIcon size={14} />
                </a>
              )}
              <p className={s.raw}>
                Feed status: {vehicle.current_status} · Vehicle ID: {vehicle.id}
              </p>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
