import { ArrowClockwiseIcon, ArrowDownIcon } from '@phosphor-icons/react';
import { TransitBusScene } from './TransitBusScene';
import { styles as s } from './FleetHero.styles';
export function FleetHero({
  refreshing,
  onRefresh,
}: {
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.masthead}>
        <p className={s.eyebrow}>Transit Desk / Greater Boston</p>
        <button className={s.refresh} disabled={refreshing} onClick={onRefresh}>
          <ArrowClockwiseIcon size={14} className={refreshing ? s.refreshing : undefined} />
          {refreshing ? 'Checking the feed…' : 'Refresh feed'}
        </button>
      </div>
      <div className={s.titleRow}>
        <h1 id="hero-title" className={s.title}>
          Boston, in service<span className={s.period}>.</span>
        </h1>
        <p className={s.copy}>
          The MBTA fleet, one report at a time.
          <br />
          Choose a vehicle to see its latest position.
        </p>
      </div>
      <TransitBusScene />
      <div className={s.lowerRail}>
        <span>Vehicle positions · routes · trips</span>
        <a href="#fleet" className={s.jump}>
          Go to vehicle index <ArrowDownIcon size={13} />
        </a>
      </div>
    </section>
  );
}
