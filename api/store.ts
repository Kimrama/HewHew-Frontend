import axios from "axios";

const BASE_URL = "http://100.79.194.71:9999";

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