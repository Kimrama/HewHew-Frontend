import axios from "axios";
import EXPO_API from "./url";
import * as SecureStore from "expo-secure-store";

export interface User {
  username: string;
  fname: string;
  lname: string;
  gender: string;
  profile_image_url: string;
}

export interface MenuQuantity {
  MenuQuantityID: string;
  MenuID: string;
  OrderID: string;
  Quantity: number;
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
  OrderID: string;
  UserOrderID: string;
  UserDeliveryID: string;
  Status: string;
  OrderDate: string;
  DeliveryMethod: string;
  ConfirmationImageURL: string;
  AppointmentTime: string;
  DropOffLocationID: string;
  MenuQuantity: MenuQuantity[];
  TransactionLog: TransactionLog;
  Notifications: string | null;
  Chats: string | null;
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

export async function getMyDelivery(): Promise<(Order & { User?: User } & {OrderbyId?: OrderbyId})[]> {
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
      const user = await getUserbyId(order.UserOrderID);
      const orderById = await getOrderbyId(order.OrderID);
      return { ...order, User: user, OrderbyId: orderById };
    } catch (err) {
      console.error(`Fetch user failed for ${order.UserOrderID}:`, err);
      return { ...order, User: undefined, OrderbyId: undefined };
    }
  })
);

  return results;
}