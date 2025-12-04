// src/components/maps/AdvancedMap.jsx
import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

const AdvancedMap = ({ place }) => {
  const center = [
    place?.lat || 20.5937,   // fallback India lat
    place?.lng || 78.9629    // fallback India lng
  ];

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border relative" style={{ zIndex: 0 }}>
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full relative"
        style={{ position: 'relative', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Main marker */}
        <Marker position={center}>
          <Popup>
            <div className="text-sm">
              <div className="font-medium">{place?.name}</div>
              <div className="text-gray-600">
                {place?.city}, {place?.country}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default AdvancedMap;