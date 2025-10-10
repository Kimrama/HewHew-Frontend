import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const BASE_URL = "http://100.79.194.71:9999";

export interface Store {
    ShopID: string;
    Adress: string;
    CanteenName: string;
    ImageURL: string | null;
    Name: string;
    State: boolean;
}

export interface Canteen {
    CanteenName: string;
    Latitude: string;
    Longitude: string;
    Shops: null;
}

export interface Menu {
    MenuID: string,
    shopID: string,
    Name: string,
    Detail: string,
    Price: number,
    Status: string, //available, unavailable
    ImageURL: string | null,
    Favourite: null,
    MenuQuantity: null,
    Tag1ID: string,
    Tag2ID: string
}

export async function getStore(): Promise<Store[]> {
    const { data } = await axios.get(`${BASE_URL}/v1/user/shop`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SecureStore.getItem("token")}`,
        },
    });
    return data.shops;
}

export async  function getCanteen(): Promise<Canteen[]> {
    const { data } = await axios.get(`${BASE_URL}/v1/canteens`, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return data.canteens;
}

export async  function getMenu(): Promise<Menu[]> {
    const { data } = await axios.get(`${BASE_URL}/v1/menu`, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    console.log(data)
    return data;
}