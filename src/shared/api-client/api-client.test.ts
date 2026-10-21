import { afterEach, expect, it, vi } from 'vitest';
import { apiRequest, ApiError } from './index';
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it('returns a friendly message for malformed JSON', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{broken', { status: 200 })));
  await expect(apiRequest('/vehicles')).rejects.toThrow('unreadable response');
});
it('keeps rate limiting distinct from missing vehicles', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 429 }))
      .mockResolvedValueOnce(new Response('{}', { status: 404 })),
  );
  await expect(apiRequest('/vehicles')).rejects.toMatchObject({ status: 429 });
  await expect(apiRequest('/vehicles/gone')).rejects.toMatchObject({ status: 404 });
});
it('passes abort signals and does not disguise cancellation as a network failure', async () => {
  const controller = new AbortController();
  controller.abort();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(controller.signal.reason));
  await expect(apiRequest('/vehicles', controller.signal)).rejects.toBe(controller.signal.reason);
});
it('maps network failures to an actionable error', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
  await expect(apiRequest('/vehicles')).rejects.toBeInstanceOf(ApiError);
});

it('ignores the fixture override in production', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('TRANSIT_TEST_API_ORIGIN', 'http://127.0.0.1:4319');
  const fetchMock = vi.fn().mockResolvedValue(new Response('{}'));
  vi.stubGlobal('fetch', fetchMock);
  await apiRequest('/vehicles');
  expect(fetchMock.mock.calls[0][0]).toBe('https://api-v3.mbta.com/vehicles');
});
it('never sends an API key to the development fixture service', async () => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.stubEnv('TRANSIT_TEST_API_ORIGIN', 'http://127.0.0.1:4319');
  vi.stubEnv('MBTA_API_KEY', 'test-only-value');
  const fetchMock = vi.fn().mockResolvedValue(new Response('{}'));
  vi.stubGlobal('fetch', fetchMock);
  await apiRequest('/vehicles');
  expect(fetchMock.mock.calls[0][0]).toBe('http://127.0.0.1:4319/vehicles');
  expect(fetchMock.mock.calls[0][1].headers).toEqual({});
});
