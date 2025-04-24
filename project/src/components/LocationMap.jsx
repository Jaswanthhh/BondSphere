import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const LocationMap = ({
  sharedLocations,
  center = { lat: 0, lng: 0 },
  zoom = 13,
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && sharedLocations.length > 0) {
      const bounds = L.latLngBounds(sharedLocations.map(loc => [loc.position.lat, loc.position.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [sharedLocations]);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sharedLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.position.lat, location.position.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{location.name}</h3>
                <p className="text-sm text-gray-500">
                  Last updated: {location.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}; 