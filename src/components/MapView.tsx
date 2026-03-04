import { useState, useEffect } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Map as MapIcon, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix typical Leaflet icon issues in React
delete (L.Icon.Default.prototype as Partial<{ _getIconUrl: string }>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to center the map when coordinates change
function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export default function MapView() {
  const [coordinates, setCoordinates] = useState({ lat: 40.7128, lng: -74.0060 });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [pulse, setPulse] = useState(false);

  useInterval(() => {
    // Simulate slight movements for the driver every 2 seconds
    setCoordinates(prev => ({
      lat: prev.lat + (Math.random() - 0.5) * 0.001,
      lng: prev.lng + (Math.random() - 0.5) * 0.001,
    }));
    setLastUpdated(new Date());
    
    // UI pulse effect for visual feedback of the "polling"
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
  }, 2000);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-[500] shrink-0 relative">
        <div className="flex items-center gap-2">
          <MapIcon className="text-indigo-600" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Driver Simulation Tracker</h2>
        </div>
        <div className={`transition-opacity duration-300 flex items-center gap-2 ${pulse ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Updating</span>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        </div>
      </div>
      
      <div className="flex-1 relative w-full h-full bg-[#aad3df]">
        {/* The true map taking the whole space, z-index 0 to stay behind overlays */}
        <MapContainer 
          center={[coordinates.lat, coordinates.lng]} 
          zoom={14} 
          scrollWheelZoom={true}
          zoomControl={false}
          className="absolute inset-0 w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]} />
          <MapUpdater center={coordinates} />
          <ZoomControl position="bottomleft" />
        </MapContainer>

        {/* Small floating HUD overlay positioned strategically in the bottom corner */}
        <div className="absolute bottom-6 right-6 z-[400] w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)] border border-indigo-100 p-4 flex flex-col gap-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-white shadow-sm shrink-0 transition-transform duration-500 ${pulse ? 'scale-110' : 'scale-100'}`}>
              <Navigation className="text-indigo-500" size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Driver Position</p>
              <p className="text-[10px] text-slate-400 font-medium">Last ping: {lastUpdated.toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center px-3 py-2 bg-slate-50/80 rounded-lg">
              <span className="text-xs font-medium text-slate-500">Lat</span>
              <span className="font-mono text-sm font-semibold text-slate-800">{coordinates.lat.toFixed(5)}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2 bg-slate-50/80 rounded-lg">
              <span className="text-xs font-medium text-slate-500">Lng</span>
              <span className="font-mono text-sm font-semibold text-slate-800">{coordinates.lng.toFixed(5)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
