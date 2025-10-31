import { Order } from "@/api/order";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface OrderContextType {
  acceptedOrders: Order[];
  acceptOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  isOrderAccepted: (orderId: string) => boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);

  const acceptOrder = (order: Order) => {
    setAcceptedOrders((prev) => {
      // Check if order is already accepted to avoid duplicates
      if (
        prev.some((acceptedOrder) => acceptedOrder.order_id === order.order_id)
      ) {
        return prev;
      }
      return [...prev, order];
    });
  };

  const removeOrder = (orderId: string) => {
    setAcceptedOrders((prev) =>
      prev.filter((order) => order.order_id !== orderId)
    );
  };

  const isOrderAccepted = (orderId: string) => {
    return acceptedOrders.some((order) => order.order_id === orderId);
  };

  const value: OrderContextType = {
    acceptedOrders,
    acceptOrder,
    removeOrder,
    isOrderAccepted,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};
