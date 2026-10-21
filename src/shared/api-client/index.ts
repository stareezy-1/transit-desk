export const MBTA_ORIGIN = 'https://api-v3.mbta.com';
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
export async function apiRequest<T>(path: string, signal?: AbortSignal): Promise<T> {
  const isServer = typeof window === 'undefined';
  const timeout = AbortSignal.timeout(15_000);
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const key = isServer ? process.env.MBTA_API_KEY : undefined;
  // Loopback-only development override for repeatable failure/loading audits.
  // Production always uses MBTA, and credentials are never sent to the fixture service.
  const testOrigin =
    isServer && process.env.NODE_ENV === 'development'
      ? process.env.TRANSIT_TEST_API_ORIGIN
      : undefined;
  const fixtureOrigin =
    testOrigin && /^http:\/\/127\.0\.0\.1:\d+$/.test(testOrigin) ? testOrigin : undefined;
  const origin = isServer ? (fixtureOrigin ?? MBTA_ORIGIN) : '/api/transit';
  let response: Response;
  try {
    response = await fetch(`${origin}${path}`, {
      signal: requestSignal,
      cache: 'no-store',
      headers: key && !fixtureOrigin ? { 'x-api-key': key } : {},
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError('The transit feed is taking too long to respond. Please try again.', 503);
  }
  if (!response.ok) {
    throw new ApiError(
      response.status === 429
        ? 'The transit feed is busy. Please wait a moment before trying again.'
        : response.status === 404
          ? 'This vehicle is no longer available in the live feed.'
          : 'We could not connect to the transit feed. Please try again.',
      response.status,
    );
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('The transit feed returned an unreadable response. Please try again.', 502);
  }
}
export function toApiPath(link: string): string {
  const url = new URL(link, MBTA_ORIGIN);
  if (url.origin !== MBTA_ORIGIN)
    throw new ApiError('The transit feed returned an invalid page link.', 502);
  return `${url.pathname}${url.search}`;
}
