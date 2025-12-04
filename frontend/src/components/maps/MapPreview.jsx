import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getCoordinates } from "../../utils/geocode";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

const MapPreview = ({ place }) => {
  const [coords, setCoords] = useState({ lat: 20, lng: 0 });
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    const loadCoords = async () => {
      let finalCoords = { lat: place.lat, lng: place.lng };

      if (!place.lat || !place.lng) {
        finalCoords = await getCoordinates(`${place.name} ${place.city}`);
      }

      setCoords(finalCoords);
      setZoom(place.country === "India" ? 11 : 10);
    };

    loadCoords();
  }, [place]);

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border">
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        <Marker position={[coords.lat, coords.lng]} icon={markerIcon}>
          <Popup>
            <div className="text-sm">
              <div className="font-medium">{place.name}</div>
              <div className="text-gray-600">
                {place.city}, {place.country}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPreview;