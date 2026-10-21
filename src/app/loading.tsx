import { fleetLoadingStyles as s } from '@/modules/fleet';
export default function Loading() {
  return (
    <main id="main-content" className={s.main} aria-busy="true">
      <p className={s.eyebrow}>Transit Desk</p>
      <h1 className={s.heading}>Connecting to the fleet.</h1>
      <p className={s.subtitle} role="status">
        Loading the latest MBTA vehicle snapshot…
      </p>
      <div className={s.grid}>
        {Array.from({ length: 6 }, (_, index) => (
          <div className={s.skeleton} key={index}>
            <div className={s.skeletonShort} />
            <div className={s.skeletonBlock} />
          </div>
        ))}
      </div>
    </main>
  );
}
