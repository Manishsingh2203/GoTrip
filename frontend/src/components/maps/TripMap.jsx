import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const TripMap = ({ locations }) => {
  const center = locations?.[0] || { lat: 26.8, lng: 82.2 };

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {/* Location markers */}
        {locations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{loc.name || `Place ${i + 1}`}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  ); 
};

export default TripMap;