import axios from "axios";
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.VITE_API_URL;

export interface Store {
    name: string;
    canteen_name: string;
    state: boolean;
    shopimg: string | null;
}

export async function getStore(): Promise<Store> {
    const { data } = await axios.get(`${BASE_URL}/v1/shop`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return data;
}