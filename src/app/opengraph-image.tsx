import { ImageResponse } from 'next/og';
export const alt = 'Transit Desk - Your fleet, in focus';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// ImageResponse uses its own inline-only renderer; these styles are intentionally local.
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: 80,
        background: '#18191c',
        color: '#fff',
      }}
    >
      <div style={{ display: 'flex', fontSize: 34 }}>
        transit<span style={{ color: '#d18d63' }}>desk</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 66, letterSpacing: -4 }}>Boston, in service.</div>
        <div style={{ fontSize: 26, color: '#a3a6a0', marginTop: 24 }}>
          Live vehicle positions. Connected routes. A clearer view.
        </div>
      </div>
      <div style={{ fontSize: 20, color: '#d18d63' }}>Independent MBTA fleet dashboard</div>
    </div>,
    size,
  );
}
