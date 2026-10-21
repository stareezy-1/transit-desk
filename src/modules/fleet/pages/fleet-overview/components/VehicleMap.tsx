'use client';
import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { styles as s } from './VehicleDetail.styles';
import 'leaflet/dist/leaflet.css';
export default function VehicleMap({
  latitude,
  longitude,
  label,
}: {
  latitude: number;
  longitude: number;
  label: string;
}) {
  const [tileError, setTileError] = useState(false);
  return (
    <div className={s.map} aria-label={`Map showing vehicle ${label} at ${latitude}, ${longitude}`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        scrollWheelZoom={false}
        className="vehicle-map"
        attributionControl
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          eventHandlers={{ tileerror: () => setTileError(true) }}
        />
        <CircleMarker
          center={[latitude, longitude]}
          radius={10}
          pathOptions={{ color: '#ffffff', fillColor: '#c67d50', fillOpacity: 1, weight: 3 }}
        >
          <Popup>Vehicle {label}</Popup>
        </CircleMarker>
      </MapContainer>
      {tileError && (
        <p className={s.mapWarning}>
          Some map tiles could not load. Coordinates remain available below.
        </p>
      )}
    </div>
  );
}
