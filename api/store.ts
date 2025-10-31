import axios from "axios";
import * as SecureStore from "expo-secure-store";

import EXPO_API from "./url";

export interface Stores {
  shop_id: string;
  adress: string;
  canteen_name: string;
  shopimage_url: string | null;
  name: string;
  state: boolean;
  tags: string[];
}

export interface Store {
  shop_id: string;
  adress: string;
  canteen_name: string;
  shop_image_url: string | null;
  name: string;
  state: boolean;
  tags: string[];
  menus: string[];
}

export interface Canteen {
  CanteenName: string;
  Latitude: string;
  Longitude: string;
  Shops: null;
}

export interface Menu {
  menu_id: string;
  name: string;
  detail: string;
  price: number;
  status: string;
  image_url: string | null;
  tag1_id: string;
  tag2_id: string;
}

export async function getStore(): Promise<Stores[]> {
  const { data } = await axios.get(`${EXPO_API}/v1/shop/shops/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SecureStore.getItem("token")}`,
    },
  });
  return data.shops;
}

export async function getStorebyId(storeId: string): Promise<Store> {
  const token = await SecureStore.getItemAsync("token");
  const { data } = await axios.get(`${EXPO_API}/v1/shop/${storeId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const menus = Array.isArray(data.menus)
    ? data.menus.map((menu: any) => menu.menu_id)
    : [];
  const store: Store = {
    shop_id: data.shop_id,
    adress: data.address,
    canteen_name: data.canteen_name,
    shop_image_url: data.shop_image_url,
    name: data.name,
    state: data.state,
    tags: data.tags ?? [],
    menus,
  };
  return store;
}

export async function getCanteen(): Promise<Canteen[]> {
  const { data } = await axios.get(`${EXPO_API}/v1/canteens`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.canteens;
}

export async function getMenubyId(menuId: string): Promise<Menu> {
  const { data } = await axios.get(`${EXPO_API}/v1/menu/${menuId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(data);
  return data;
}
