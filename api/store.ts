import axios from "axios";
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.VITE_API_URL;

export interface Store {
    Name: string;
    CanteenName: string;
    State: boolean;
    ImageURL: string | null;
}

export async function getStore(): Promise<Store> {
    const { data } = await axios.get(`${BASE_URL}/v1/user/shop`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return data;
}