"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon markers in Next.js
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Inside HandshakeMap.js
export default function HandshakeMap({ mapData, isDark }) {
  return (
    <MapContainer center={[20, 0]} zoom={2} className="h-full w-full grayscale-[20%]">
      <TileLayer 
        url={isDark 
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        } 
      />
      {/* ... Markers ... */}
    </MapContainer>
  );
}