import { ArrowUpRightIcon, BusIcon, TrainIcon, BoatIcon } from '@phosphor-icons/react';
import type { IVehicle } from '../../../types';
import { formatCoordinate, formatTimestamp, statusLabel } from '../../../utils/vehicles';
import { styles as s } from './VehicleCard.styles';
import { statusStyles } from '../fleet-overview.styles';
export function VehicleCard({
  vehicle,
  onSelect,
}: {
  vehicle: IVehicle;
  onSelect: (id: string) => void;
}) {
  const Icon =
    vehicle.routeType === 4
      ? BoatIcon
      : vehicle.routeType !== null && vehicle.routeType < 3
        ? TrainIcon
        : BusIcon;
  const type =
    vehicle.routeType === 4
      ? 'Ferry'
      : vehicle.routeType !== null && vehicle.routeType < 3
        ? 'Rail'
        : 'Bus';
  return (
    <article className={s.card}>
      <div className={s.top}>
        <span className={s.mode}>
          <Icon size={15} /> {type} / {vehicle.routeLabel}
        </span>
        <span
          className={statusStyles({
            status: ['IN_TRANSIT_TO', 'STOPPED_AT', 'INCOMING_AT'].includes(vehicle.current_status)
              ? (vehicle.current_status as 'IN_TRANSIT_TO')
              : 'unknown',
          })}
        >
          <span className={s.dot} />
          {statusLabel(vehicle.current_status)}
        </span>
      </div>
      <div className={s.body}>
        <div className={s.identity}>
          <p className={s.eyebrow}>Vehicle no.</p>
          <h3 className={s.title}>{vehicle.label || vehicle.id}</h3>
        </div>
        <div className={s.journey}>
          <p className={s.eyebrow}>Heading toward</p>
          <p className={s.destination} title={vehicle.headsign}>
            {vehicle.headsign}
          </p>
          <p className={s.routeName}>{vehicle.routeName}</p>
        </div>
        <button
          id={`vehicle-trigger-${vehicle.id}`}
          className={s.button}
          onClick={() => onSelect(vehicle.id)}
          aria-label={`View vehicle ${vehicle.label || vehicle.id}`}
        >
          <ArrowUpRightIcon size={24} />
          <span className={s.buttonLabel}>Details</span>
        </button>
      </div>
      <dl className={s.coordinates}>
        <div>
          <dt className={s.label}>Latitude</dt>
          <dd className={s.value}>{formatCoordinate(vehicle.latitude)}</dd>
        </div>
        <div>
          <dt className={s.label}>Longitude</dt>
          <dd className={s.value}>{formatCoordinate(vehicle.longitude)}</dd>
        </div>
        <div>
          <dt className={s.label}>Last signal</dt>
          <dd className={s.value}>
            <time dateTime={vehicle.updated_at} title={formatTimestamp(vehicle.updated_at, true)}>
              {formatTimestamp(vehicle.updated_at)}
            </time>
          </dd>
        </div>
      </dl>
    </article>
  );
}
