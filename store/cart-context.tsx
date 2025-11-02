import React, { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";

// Define the shape of an item in the cart
export interface CartItem {
  menu_id: string;
  quantity: number;
  storeName?: string;
}

// Define the shape of the cart context
interface CartContextType {
  items: CartItem[];
  addToCart: (menuId: string, storeName?: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  removeFromCart: (menuId: string) => void;
  getCartItemQuantity: (menuId: string) => number;
  clearCart: () => void;
  totalItems: number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (menuId: string, storeName?: string) => {
    const firstItem = items[0];
    if (firstItem && firstItem.storeName !== storeName) {
      Alert.alert(
        "Different Store",
        "You can only order from one store at a time. Please clear your cart to order from a new store.",
        [{ text: "OK" }]
      );
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.menu_id === menuId);
      if (existingItem) {
        // If item already exists, update its quantity
        return prevItems.map((i) =>
          i.menu_id === menuId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Otherwise, add new item to the cart
      return [...prevItems, { menu_id: menuId, quantity: 1, storeName }];
    });
  };

  const updateQuantity = (menuId: string, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return prevItems.filter((i) => i.menu_id !== menuId);
      }
      // Otherwise, update the quantity of the existing item
      const existingItem = prevItems.find((i) => i.menu_id === menuId);
      if (existingItem) {
        return prevItems.map((i) =>
          i.menu_id === menuId ? { ...i, quantity } : i
        );
      }
      // if not exist, add it
      return [...prevItems, { menu_id: menuId, quantity: 1 }];
    });
  };

  const removeFromCart = (menuId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.menu_id !== menuId));
  };

  const getCartItemQuantity = (menuId: string) => {
    const item = items.find((i) => i.menu_id === menuId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        getCartItemQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
