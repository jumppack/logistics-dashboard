import React, { useCallback } from 'react';
import { useOrderStore, type OrderStatus } from '../store/useOrderStore';
import { Package, ChefHat, Truck, CheckCircle2 } from 'lucide-react';

const statusConfig: Record<OrderStatus, { color: string, icon: React.ReactNode }> = {
  'Pending': { color: 'text-gray-500 bg-gray-100', icon: <Package size={16} /> },
  'Preparing': { color: 'text-amber-600 bg-amber-50', icon: <ChefHat size={16} /> },
  'Out for Delivery': { color: 'text-blue-600 bg-blue-50', icon: <Truck size={16} /> },
  'Delivered': { color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle2 size={16} /> }
};

const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
  'Pending': 'Preparing',
  'Preparing': 'Out for Delivery',
  'Out for Delivery': 'Delivered',
  'Delivered': null
};

interface OrderItemProps {
  id: string;
  style: React.CSSProperties;
}

// React.memo rationale:
// By wrapping `OrderItem` in React.memo, this component will skip rendering if its props (`id`, `style`)
// have not changed. The `id` is a string primitive, and `react-window` calculates `style` inline 
// but keeps it stable per row instance. The primary performance win comes from how it selects state:
// Only when `state.orders[id]` changes will this *specific* instantiated component re-render.
const OrderItem = React.memo(({ id, style }: OrderItemProps) => {
  // Subscription rationale: Subscribing specifically to this ID's order prevents this component
  // from re-rendering when other orders in the dictionary update.
  const order = useOrderStore((state) => state.orders[id]);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  // useCallback rationale:
  // Defining this function with `useCallback` ensures that the reference stays stable across
  // re-renders of `OrderItem`. While less critical here because it's a leaf node passing to a native <button>,
  // using `useCallback` with a dependency array ensures we don't accidentally close over stale `order.status`.
  // If we passed `handleAdvanceStatus` as a prop to another pure component, `useCallback` would be mandatory.
  const handleAdvanceStatus = useCallback(() => {
    if (!order) return;
    const nextStatus = nextStatusMap[order.status];
    if (nextStatus) {
      updateOrderStatus(id, nextStatus);
    }
  }, [id, order, updateOrderStatus]);

  if (!order) return null;

  const config = statusConfig[order.status];
  const isComplete = order.status === 'Delivered';

  return (
    <div style={style} className="px-4 py-2">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between transition-colors hover:border-blue-200 h-full">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-800">Order #{order.id.split('-')[1]}</span>
          <span className="text-sm text-gray-500">{order.customerName} - ${order.totalAmount}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}>
            {config.icon}
            <span>{order.status}</span>
          </div>
          
          <button
            onClick={handleAdvanceStatus}
            disabled={isComplete}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isComplete 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isComplete ? 'Done' : 'Advance Status'}
          </button>
        </div>
      </div>
    </div>
  );
});

OrderItem.displayName = 'OrderItem';
export default OrderItem;
