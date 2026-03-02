import LiveOrders from './components/LiveOrders';
import MapView from './components/MapView';
import { PackageSearch } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 shrink-0 shadow-sm z-20">
        <div className="bg-blue-600 p-2.5 rounded-xl shadow-inner border border-blue-500 cursor-pointer hover:bg-blue-700 transition-colors">
          <PackageSearch className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">Logistics Command Center</h1>
          <p className="text-sm text-gray-500 mt-1.5 font-medium tracking-wide">Real-time Performance Dashboard</p>
        </div>
      </header>
      
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden lg:max-h-[calc(100vh-80px)]">
        {/* Left Column: Virtualized List maintaining 1000+ items locally via Zustand normalized state */}
        <div className="h-[600px] lg:h-full flex flex-col shadow-sm rounded-xl hover:shadow-md transition-shadow">
          <LiveOrders />
        </div>

        {/* Right Column: Local Map Polling Simulator firing every 2s completely isolated from the main list */}
        <div className="h-[500px] lg:h-full flex flex-col shadow-sm rounded-xl hover:shadow-md transition-shadow">
          <MapView />
        </div>
      </main>
    </div>
  );
}

export default App;
