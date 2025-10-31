import axios from "axios";
import * as SecureStore from "expo-secure-store";
import EXPO_API from "./url";

export interface User {
  username: string;
  fname: string;
  lname: string;
  gender: string;
  profile_image_url: string;
}

export interface menu_quantity {
  MenuQuantityID: string;
  menu_id: string;
  OrderID: string;
  quantity: number;
}

export interface TransactionLog {
  TransactionLogID: string;
  TargetUserID: string;
  OrderID: string;
  TimeStamp: string;
  Detail: string;
  Amount: number;
}

export interface Order {
  order_id: string;
  user_order_id: string;
  UserDeliveryID: string;
  status: string;
  order_date: string;
  delivery_method: string;
  ConfirmationImageURL: string;
  appointment_time: string;
  drop_off_location_id: string;
  menu_quantity: menu_quantity[];
  TransactionLog: TransactionLog;
  Notifications: string | null;
  Chats: string | null;
  shop_name: string;
  canteen_name: string;
  shipping_fee: number;
}

export interface OrderbyId {
  shop_name: string;
  canteen_name: string;
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

export async function getOrderbyId(UserId: string): Promise<OrderbyId> {
  const token = await SecureStore.getItem("token");
  const { data } = await axios.get(`${EXPO_API}/v1/order/${UserId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export async function getMyDelivery(): Promise<
  (Order & { User?: User } & { OrderbyId?: OrderbyId })[]
> {
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
        const orderById = await getOrderbyId(order.order_id);
        return { ...order, User: user, OrderbyId: orderById };
      } catch (err) {
        console.error(`Fetch user failed for ${order.user_order_id}:`, err);
        return { ...order, User: undefined, OrderbyId: undefined };
      }
    })
  );

  return results;
}
