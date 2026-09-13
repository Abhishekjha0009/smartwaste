import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';
import { MapPin, ArrowUpRight } from 'lucide-react';

// Custom Leaflet Pin Icon generator
const createCustomIcon = (status, severity) => {
  let color = '#3B82F6'; // default blue
  if (status === 'Pending') color = '#EF4444'; // Red
  if (status === 'Assigned') color = '#F59E0B'; // Amber
  if (status === 'In Progress') color = '#6366F1'; // Indigo
  if (status === 'Resolved') color = '#10B981'; // Emerald

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36" stroke="#ffffff" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
};

export default function MapView({ complaints = [], height = "450px", center = [28.6139, 77.2090], zoom = 12 }) {
  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {complaints.map((item) => {
          const lat = item.location?.latitude || 28.6139;
          const lng = item.location?.longitude || 77.2090;

          return (
            <Marker
              key={item._id}
              position={[lat, lng]}
              icon={createCustomIcon(item.status, item.severity)}
            >
              <Popup>
                <div className="p-1 space-y-2 max-w-xs text-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={item.status} />
                    <SeverityBadge severity={item.severity} />
                  </div>

                  <h4 className="font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                  
                  <div className="flex items-center gap-1 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-eco-400 shrink-0" />
                    <span className="truncate">{item.location?.address || 'Zone Area'}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-700 text-slate-400">
                    <span>Category: <strong className="text-eco-400">{item.category}</strong></span>
                    <span>Worker: {item.assignedWorkerName || 'Unassigned'}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
