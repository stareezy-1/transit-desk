import { FleetOverviewPage, getFleetSnapshot, type IFleetSnapshot } from '@/modules/fleet';
import { serializeJsonLd, SITE_URL, SITE_DESCRIPTION } from '@/shared/seo';
export const dynamic = 'force-dynamic';
export default async function Page() {
  let initialData: IFleetSnapshot | undefined;
  try {
    initialData = await getFleetSnapshot();
  } catch {
    /* The client renders an actionable retry state if the feed is unavailable. */
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Transit Desk',
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web browser',
            isAccessibleForFree: true,
            about: { '@type': 'Thing', name: 'MBTA vehicle monitoring' },
          }),
        }}
      />
      <FleetOverviewPage initialData={initialData} />
    </>
  );
}
