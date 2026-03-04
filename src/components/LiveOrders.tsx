import React, { useEffect, useState, useMemo } from 'react';
import { List } from 'react-window';
import { useOrderStore } from '../store/useOrderStore';
import OrderItem from './OrderItem';
import { Activity } from 'lucide-react';

const WindowList = List as React.ElementType;

export default function LiveOrders() {
  const initializeOrders = useOrderStore(state => state.initializeOrders);
  
  // Subscription rationale: We only subscribe to `orderIds` array. 
  // Zustand's selector checks strict equality (===), meaning as long as the array reference
  // is stable (which it is in our implementation where we only mutate dictionary contents),
  // this parent component WILL NOT render when individual orders update their status!
  const orderIds = useOrderStore((state) => state.orderIds);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Generate 1000 items inside the store upon mounting
    initializeOrders(1000); 
    // Defer state update to avoid synchronous cascade render warnings
    const timer = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timer);
  }, [initializeOrders]);

  // useMemo rationale:
  // Using useMemo for the Row component prevents it from being fundamentally redeclared 
  // on every render of `LiveOrders` (if `LiveOrders` were to render). A stable Row component
  // is necessary for `react-window` to avoid tearing down and rebuilding DOM nodes unnecessarily.
  const Row = useMemo(() => {
    return function LiveOrderRow({ index, style }: { index: number; style: React.CSSProperties }) {
      const id = orderIds[index];
      return <OrderItem id={id} style={style} />;
    };
  }, [orderIds]);

  // Avoid rendering before the store determines the list
  if (!isReady || orderIds.length === 0) return null; 

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2">
          <Activity className="text-blue-600 animate-pulse" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Live Orders ({orderIds.length})</h2>
        </div>
        <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 bg-green-500 rounded-full animate-ping inline-block"></span>
          System Online
        </span>
      </div>
      
      <div className="flex-1 w-full bg-gray-50/50">
        {/* Virtualized List rationale:
            Renders only the DOM nodes currently visible (+ overscan). 
            Even with 1000+ items, the browser only manages ~10-15 nodes, keeping FPS high. */}
        <WindowList
          height={600}      
          rowCount={orderIds.length}
          rowHeight={96}     
          width="100%"
          overscanCount={5} 
          rowComponent={Row}
          rowProps={{}}
        />
      </div>
    </div>
  );
}
