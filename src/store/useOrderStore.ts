import { create } from 'zustand';

export type OrderStatus = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  status: OrderStatus;
  customerName: string;
  totalAmount: number;
}

interface OrderState {
  orders: Record<string, Order>; // Normalized dictionary to prevent O(n) lookups and allow atomic subscriptions
  orderIds: string[]; // Maintaining the list of IDs for the virtualized list to map over
  updateOrderStatus: (id: string, newStatus: OrderStatus) => void;
  // Expose an initializer useful for generating the 1000 items
  initializeOrders: (count: number) => void;
}

// Generates fake orders for the simulation
const generateMockOrders = (count: number) => {
  const orders: Record<string, Order> = {};
  const orderIds: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const id = `order-${i}`;
    orders[id] = {
      id,
      status: 'Pending',
      customerName: `Customer ${i + 1}`,
      totalAmount: Math.floor(Math.random() * 100) + 10,
    };
    orderIds.push(id);
  }
  
  return { orders, orderIds };
};

export const useOrderStore = create<OrderState>((set) => ({
  orders: {},
  orderIds: [],
  
  // Performance caching logic:
  // Using a normalized state allows atomic updates where we only reconstruct the specific 
  // orders dictionary and the single nested `order` object.
  // The `orderIds` array remains referentially stable, preventing the main List from re-rendering
  // completely. React-window simply sees the same array. Let each Item independently update!
  updateOrderStatus: (id, newStatus) => 
    set((state) => {
      const order = state.orders[id];
      if (!order) return state;

      return {
        orders: {
          ...state.orders,
          [id]: {
            ...order,
            status: newStatus
          }
        }
      };
    }),
    
  initializeOrders: (count) => {
    const { orders, orderIds } = generateMockOrders(count);
    set({ orders, orderIds });
  }
}));
