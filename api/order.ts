import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getMenubyId, Menu } from "./store";
import EXPO_API from "./url";

export interface User {
  username: string;
  fname: string;
  lname: string;
  gender: string;
  profile_image_url: string;
}

export interface menu_quantity {
  menu_id: string;
  quantity: number;
}

export interface Order {
  order_id: string;
  user_order_id: string;
  user_delivery_id: string;
  status: string;
  order_date: string;
  delivery_method: string;
  appointment_time: string;
  menu_quantity: menu_quantity[];
  amount: number;
  shop_name: string;
  canteen_name: string;
  shipping_fee: number;
  confirmation_image_url: string;
}

export interface OrderbyId {
  order_id: string;
  user_order_id: string;
  user_delivery_id: string;
  status: string;
  order_date: string;
  delivery_method: string;
  confirmation_image_url: string;
  appointment_time: string;
  drop_off_location_id: string;
  menu_quantity: menu_quantity[];
  amount: number;
  shop_name: string;
  canteen_name: string;
  shipping_fee: number;
}

export interface DropOff {
  name: string;
  detail: string;
}

export async function getOrder(): Promise<Order[]> {
  const { data } = await axios.get(`${EXPO_API}/v1/order/available`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SecureStore.getItem("token")}`,
    },
  });
  return data;
}

export async function getOrderbyId(orderId: string): Promise<
    Order & { 
      User?: User; 
      menus: { name: string; detail: string; price: number; quantity: number }[]; 
      totalQuantity: number; 
      dropOffLocation?: DropOff;
    }
  > {
    const token = await SecureStore.getItem("token");
    const { data } = await axios.get(`${EXPO_API}/v1/order/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let user: User | undefined;
    try {
      user = await getUserbyId(data.user_order_id);
    } catch (err) {
      console.error("Fetch user failed:", err);
    }

    const menus = await Promise.all(
      (data.menu_quantity ?? []).map(async (item: any) => {
        try {
          const menuData: Menu = await getMenubyId(item.menu_id);
          return {
            name: menuData.name,
            detail: menuData.detail,
            price: menuData.price,
            quantity: item.quantity,
          };
        } catch (menuErr) {
          console.error("Fetch menu failed:", menuErr);
          return { name: "Unknown", detail: "", price: 0, quantity: item.quantity };
        }
      })
    );

    const totalQuantity = menus.reduce((sum, m) => sum + (m.quantity ?? 0), 0);

    let dropOffLocation: DropOff | undefined;
    try {
      if (data.drop_off_location_id) {
        dropOffLocation = await getDropOffbyId(data.drop_off_location_id);
      }
    } catch (err) {
      console.error("Fetch drop-off location failed:", err);
    }

    return { ...data, User: user, menus, totalQuantity, dropOffLocation };
  }

export async function getUserbyId(UserId: string): Promise<User> {
  const token = await SecureStore.getItem("token");
  const { data } = await axios.get(`${EXPO_API}/v1/user/${UserId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export async function getMyDelivery(): Promise<(Order & { User?: User })[]> {
  const token = await SecureStore.getItem("token");

  const { data } = await axios.get(`${EXPO_API}/v1/order/delivery`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const orders: Order[] = data;

  const results = await Promise.all(
  orders.map(async (order) => {
    try {
      const user = await getUserbyId(order.user_order_id);
      return { ...order, User: user };
    } catch (err) {
      console.error(`Fetch user failed for ${order.user_order_id}:`, err);
      return { ...order, User: undefined, OrderbyId: undefined };
    }
  })
);

  return results;
}

export async function getMyOrder(): Promise<(Order & { User?: User })[]> {
  const token = await SecureStore.getItem("token");

  const { data } = await axios.get(`${EXPO_API}/v1/order/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const orders: Order[] = data;

  const results = await Promise.all(
  orders.map(async (order) => {
    try {
      const user = await getUserbyId(order.user_delivery_id);
      return { ...order, User: user };
    } catch (err) {
      console.error(`Fetch user failed for ${order.user_delivery_id}:`, err);
      return { ...order, User: undefined, OrderbyId: undefined };
    }
  })
);

  return results;
}

export async function getDropOffbyId(dropOffId: string): Promise<DropOff> {
  const token = await SecureStore.getItem("token");
  const { data } = await axios.get(`${EXPO_API}/v1/dropOff/${dropOffId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export async function acceptOrderbyRider(orderId: string): Promise<any> {
  try {
    const token = await SecureStore.getItemAsync("token");
    const formData = new FormData();
    formData.append("order_id", orderId);

    const { data } = await axios.post(
      `${EXPO_API}/v1/order/accept/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Failed to accept order:", error);
    throw error;
  }
}
