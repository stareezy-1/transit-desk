export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);
export const SITE_DESCRIPTION =
  'Explore live MBTA vehicle positions, routes, and trips with Transit Desk. Filter the fleet, inspect vehicle details, and understand the transit feed.';
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
