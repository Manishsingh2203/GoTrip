import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ZoomIn, ZoomOut, Compass } from 'lucide-react';

// Fix default marker paths for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color = '#2563EB') => {
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-6 h-6 bg-white rounded-full shadow-lg border-2 border-white flex items-center justify-center">
          <div class="w-4 h-4 rounded-full" style="background-color: ${color}"></div>
        </div>
        <div class="absolute inset-0 animate-ping rounded-full" style="background-color: ${color}; opacity: 0.3"></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const MapWidget = ({ 
  center, 
  zoom = 13, 
  markers = [], 
  className = "h-64",
  showControls = true,
  interactive = true
}) => {

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [userLocation, setUserLocation] = useState(null);

  // INIT MAP SAFELY
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (!center || !Array.isArray(center) || center.length !== 2) return;

    const [lat, lng] = center;
    if (isNaN(lat) || isNaN(lng)) return;

    try {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: interactive,
        dragging: interactive
      }).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.on('zoomend', () => {
        setCurrentZoom(mapInstanceRef.current?.getZoom() ?? zoom);
      });

      if (showControls && interactive) {
        L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);

        const locationControl = L.control({ position: 'topright' });
        locationControl.onAdd = () => {
          const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          div.innerHTML = `
            <a href="#" class="leaflet-control-location" title="Find my location">
             📍
            </a>
          `;
          return div;
        };
        locationControl.addTo(mapInstanceRef.current);

        setTimeout(() => {
          if (!mapRef.current) return;
          const btn = document.querySelector('.leaflet-control-location');
          if (btn) btn.onclick = (e) => {
            e.preventDefault();
            handleFindMyLocation();
          };
        }, 500);
      }

      return () => {
        mapInstanceRef.current?.remove();
        mapInstanceRef.current = null;
      };
    } catch (err) {
      console.error("Map init error:", err);
    }
  }, []);

  // UPDATE CENTER
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const [lat, lng] = center || [];
    if (!isNaN(lat) && !isNaN(lng)) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // UPDATE MARKERS
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(m => mapInstanceRef.current.removeLayer(m));
    markersRef.current = [];

    markers.forEach((marker, i) => {
      if (!Array.isArray(marker.position)) return;
      const [lat, lng] = marker.position;
      if (isNaN(lat) || isNaN(lng)) return;

      const icon = createCustomIcon(marker.color);
      const m = L.marker(marker.position, { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(marker.title || "Location");

      markersRef.current.push(m);

      if (i === 0) setTimeout(() => m.openPopup(), 300);
    });

    if (markers.length > 1) {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [markers]);

  // FIND MY LOCATION
  const handleFindMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation([coords.latitude, coords.longitude]);
        const icon = createCustomIcon("#2563EB");

        const m = L.marker([coords.latitude, coords.longitude], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup("You are here")
          .openPopup();

        mapInstanceRef.current.setView([coords.latitude, coords.longitude], 14);
      },
      () => alert("Location access blocked")
    );
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border z-0 ${className}`}>
      <div className="absolute top-0 left-0 right-0 z-10 p-3 bg-blue-600/80 backdrop-blur text-white flex items-center gap-2">
        <Compass size={18} />
        <span className="font-semibold">Map View</span>  
      </div>

      <div ref={mapRef} className="w-full h-full" />

      {interactive && showControls && (
        <>
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="absolute bottom-4 right-4 bg-white p-3 rounded shadow z-10"
          >
            <ZoomIn />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="absolute bottom-16 right-4 bg-white p-3 rounded shadow z-10"
          >
            <ZoomOut />
          </button>
          <button
            onClick={handleFindMyLocation}
            className="absolute bottom-4 left-4 bg-white p-3 rounded shadow z-10"
          >
            <Navigation />
          </button>
        </>
      )}
    </div>
  );
};

export default MapWidget;
