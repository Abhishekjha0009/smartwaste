import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, MapPin, CheckCircle } from 'lucide-react';

const pinIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10B981" width="40" height="40" stroke="#ffffff" stroke-width="2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `,
  className: 'leaflet-picker-pin',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function LocationMarker({ position, setPosition, onSelectLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      if (onSelectLocation) onSelectLocation(lat, lng);
    }
  });

  return position ? <Marker position={position} icon={pinIcon} /> : null;
}

export default function MapPicker({ defaultLat = 28.6139, defaultLng = 77.2090, onSelectLocation }) {
  const [position, setPosition] = useState([defaultLat, defaultLng]);
  const [geoLocating, setGeoLocating] = useState(false);
  const [addressNotice, setAddressNotice] = useState('');

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      setGeoLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          setGeoLocating(false);
          setAddressNotice('Current GPS Coordinates Detected');
          if (onSelectLocation) onSelectLocation(lat, lng);
        },
        (err) => {
          console.warn('Geolocation failed/denied:', err.message);
          setGeoLocating(false);
          setAddressNotice('Location permission denied. Click map to set pin.');
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-eco-400" /> Pin Waste Location on Map
        </label>
        
        <button
          type="button"
          onClick={handleUseGPS}
          disabled={geoLocating}
          className="px-3 py-1.5 rounded-lg bg-eco-500/10 hover:bg-eco-500/20 text-eco-400 border border-eco-500/30 text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <Crosshair className={`w-3.5 h-3.5 ${geoLocating ? 'animate-spin' : ''}`} />
          {geoLocating ? 'Detecting GPS...' : 'Use My Live GPS'}
        </button>
      </div>

      <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-800 relative shadow-inner">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onSelectLocation={onSelectLocation}
          />
        </MapContainer>

        <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between z-[1000]">
          <span>Lat: <strong className="text-eco-400 font-mono">{position[0].toFixed(5)}</strong></span>
          <span>Lng: <strong className="text-eco-400 font-mono">{position[1].toFixed(5)}</strong></span>
          <span className="text-slate-400">Click map to adjust pin</span>
        </div>
      </div>

      {addressNotice && (
        <div className="text-xs text-eco-400 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" /> {addressNotice}
        </div>
      )}
    </div>
  );
}
