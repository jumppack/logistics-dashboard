import { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Map, Navigation } from 'lucide-react';

export default function MapView() {
  // MapView Polling Rationale:
  // Instead of pushing this rapidly updating state (every 2s) to a global store like Zustand or Context,
  // we keep it entirely localized to `MapView`. 
  // This physically isolates the re-renders. The 1,000 live orders list will never know about or 
  // be affected by the 2s timer firing here.
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
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2">
          <Map className="text-indigo-600" size={20} />
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
      
      <div className="flex-1 p-6 flex items-center justify-center relative overflow-hidden bg-white">
        {/* Placeholder Map Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl border border-indigo-50 p-8 flex flex-col items-center gap-8">
          <div className="h-24 w-24 rounded-full bg-indigo-50 flex items-center justify-center border-4 border-white shadow-[0_0_15px_rgba(79,70,229,0.1)] relative">
            <Navigation 
               className={`text-indigo-500 transition-transform duration-1000 ${pulse ? 'scale-110' : 'scale-100'}`} 
               size={40} 
            />
          </div>
          
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-medium text-slate-500">Latitude</span>
              <span className="font-mono text-lg font-semibold text-slate-800">{coordinates.lat.toFixed(5)}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-medium text-slate-500">Longitude</span>
              <span className="font-mono text-lg font-semibold text-slate-800">{coordinates.lng.toFixed(5)}</span>
            </div>
          </div>
          
          <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
            <span>Last polled:</span>
            <span className="font-medium text-slate-600">{lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
