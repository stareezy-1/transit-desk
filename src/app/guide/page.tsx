import type { Metadata } from 'next';
import { GuidePage } from '@/modules/guide';
export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Field Guide: Vehicle Data, Routes & FAQ',
  description:
    'Learn how Transit Desk uses MBTA data, how route and trip filters work, and what each vehicle status means. Clear answers with original data sources.',
  alternates: { canonical: '/guide' },
  openGraph: {
    title: 'Transit Desk Field Guide',
    description: 'A practical guide to MBTA vehicle data, filtering, and status signals.',
    url: '/guide',
    images: ['/opengraph-image'],
  },
};
export default function Page() {
  return <GuidePage />;
}
