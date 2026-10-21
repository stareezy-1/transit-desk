import http from 'node:http';
let scenario = 'normal';
const scenarios = [
  'normal',
  'slow',
  'vehicles-error',
  'detail-error',
  'routes-error',
  'trips-error',
  'empty',
  'missing-position',
  'malformed',
  'shrunk',
];
const vehicle = (index) => ({
  id: `v${index}`,
  type: 'vehicle',
  attributes: {
    label: String(4101 + index),
    current_status: ['IN_TRANSIT_TO', 'STOPPED_AT', 'INCOMING_AT'][index % 3],
    latitude: scenario === 'missing-position' ? null : 42.36 + index / 1000,
    longitude: scenario === 'missing-position' ? null : -71.06,
    updated_at: '2026-10-15T03:00:00Z',
    bearing: 90,
    speed: 7,
    occupancy_status: 'MANY_SEATS_AVAILABLE',
    direction_id: 0,
    current_stop_sequence: 2,
  },
  relationships: {
    route: { data: { id: index < 8 ? '1' : '2', type: 'route' } },
    trip: { data: { id: `t${index}`, type: 'trip' } },
    stop: { data: { id: 'stop1', type: 'stop' } },
  },
});
const included = [
  ...['1', '2'].map((id) => ({
    id,
    type: 'route',
    attributes: {
      short_name: id,
      long_name: `Test route ${id}`,
      type: 3,
      direction_names: ['Outbound', 'Inbound'],
    },
  })),
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `t${i}`,
    type: 'trip',
    attributes: { headsign: i < 8 ? 'Harvard Square' : 'Central Station' },
  })),
  { id: 'stop1', type: 'stop', attributes: { name: 'Park Street' } },
];
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1:4319');
    if (url.pathname === '/__control') {
      if (req.method === 'POST') {
        let body = '';
        for await (const chunk of req) body += chunk;
        const candidate = new URLSearchParams(body).get('scenario');
        if (scenarios.includes(candidate)) scenario = candidate;
        res.writeHead(303, { Location: '/__control' });
        return res.end();
      }
      res.setHeader('Content-Type', 'text/html');
      return res.end(
        `<html lang="en"><head><title>Transit QA control</title></head><body><h1>Transit QA control</h1><p role="status">Scenario: ${scenario}</p><form method="post">${scenarios.map((s) => `<button name="scenario" value="${s}">${s}</button>`).join(' ')}</form><p>Local fixture service. Not included in the production application.</p></body></html>`,
      );
    }
    const isDetail = url.pathname.startsWith('/vehicles/');
    const kind = isDetail ? 'detail' : url.pathname.slice(1);
    if (scenario === 'slow') await new Promise((resolve) => setTimeout(resolve, 1400));
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    if (scenario === `${kind}-error`) {
      res.statusCode = 429;
      return res.end(JSON.stringify({ errors: [{ detail: 'Test error' }] }));
    }
    if (scenario === 'malformed' && kind === 'vehicles') return res.end('{broken');
    if (kind === 'vehicles')
      return res.end(
        JSON.stringify({
          data:
            scenario === 'empty'
              ? []
              : Array.from({ length: scenario === 'shrunk' ? 1 : 16 }, (_, i) => vehicle(i)),
          included,
        }),
      );
    if (isDetail)
      return res.end(
        JSON.stringify({ data: vehicle(Number(url.pathname.split('/').pop().slice(1))), included }),
      );
    if (kind === 'routes' || kind === 'trips') {
      const offset = Number(url.searchParams.get('page[offset]') || 0);
      const data = Array.from({ length: 25 }, (_, i) => ({
        id: kind === 'routes' ? String(offset + i + 1) : `t${offset + i}`,
        type: kind === 'routes' ? 'route' : 'trip',
        attributes:
          kind === 'routes'
            ? {
                short_name: `Route ${offset + i + 1}`,
                long_name: `Route destination ${offset + i + 1}`,
              }
            : { headsign: `Scheduled trip ${offset + i}` },
      }));
      return res.end(
        JSON.stringify({
          data,
          links: offset === 0 ? { next: `https://api-v3.mbta.com/${kind}?page[offset]=25` } : {},
        }),
      );
    }
    res.statusCode = 404;
    res.end('{}');
  })
  .listen(4319, '127.0.0.1', () => console.log('Fixture control: http://127.0.0.1:4319/__control'));
