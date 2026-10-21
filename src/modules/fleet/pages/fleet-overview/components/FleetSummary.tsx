import type { IVehicle } from '../../../types';
import { styles as s } from './FleetSummary.styles';
export function FleetSummary({ vehicles, isError }: { vehicles?: IVehicle[]; isError: boolean }) {
  const metrics = [
    { label: 'Vehicles reporting', value: vehicles?.length },
    {
      label: 'In transit',
      value: vehicles?.filter((v) => v.current_status === 'IN_TRANSIT_TO').length,
    },
    {
      label: 'At a stop',
      value: vehicles?.filter((v) => v.current_status === 'STOPPED_AT').length,
    },
    {
      label: 'Active routes',
      value: vehicles ? new Set(vehicles.map((v) => v.routeId).filter(Boolean)).size : undefined,
    },
  ];
  return (
    <section className={s.overview} aria-label="Network overview">
      <div className={s.intro}>
        <span className={s.dot} />
        <p>
          {isError ? 'Last available' : 'Network'}
          <br />
          snapshot
        </p>
        <span className={s.index}>01 — 04</span>
      </div>
      <dl className={s.metrics}>
        {metrics.map((metric, index) => (
          <div className={s.metric} key={metric.label}>
            <dt className={s.label}>
              <span className={s.index}>0{index + 1}</span>
              {metric.label}
            </dt>
            <dd className={s.value}>
              {metric.value === undefined ? '—' : metric.value.toLocaleString('en-US')}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
