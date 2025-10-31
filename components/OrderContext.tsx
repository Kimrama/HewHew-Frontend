import React, { createContext, useContext, useState, ReactNode } from "react";

export type OrderType = {
  OrderID: string;
};

type OrderContextType = {
  orders: OrderType[];
  selectOrder: (id: string) => void;
  deselectOrder: (id: string) => void;
  deleteOrder: (id: string) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children, initialOrders }: { children: ReactNode, initialOrders: OrderType[] }) => {
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);

  const selectOrder = (id: string) => {
    setOrders(prev =>
      prev.map(o => (o.OrderID === id ? { ...o, selected: true } : o))
    );
  };

  const deselectOrder = (id: string) => {
    setOrders(prev =>
      prev.map(o => (o.OrderID === id ? { ...o, selected: false } : o))
    );
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.OrderID !== id));
  };

  return (
    <OrderContext.Provider value={{ orders, selectOrder, deselectOrder, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
