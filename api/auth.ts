import {
  singInResponse,
  singUpResponse,
  UserSignIn,
  UserSignUp,
} from "@/types/user";
import * as SecureStore from "expo-secure-store";

import axios from "axios";
import EXPO_API from "./url";

export async function signIn(userData: UserSignIn): Promise<singInResponse> {
  const { data } = await axios.post(`${EXPO_API}/v1/user/login`, userData);
  return data;
}

export async function signUp(
  userData: UserSignUp,
  imageUri?: string
): Promise<singUpResponse> {
  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (imageUri) {
    const filename = imageUri.split("/").pop() || "photo.jpg";
    const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    formData.append("image", {
      uri: imageUri,
      name: filename,
      type,
    } as any);
  }
  const { data } = await axios.post(`${EXPO_API}/v1/user/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export interface UserProfile {
  user_id: string;
  username: string;
  fname: string;
  lname: string;
  gender: string;
  profile_image_url: string;
  wallet: string;
}

export async function getUserProfile(): Promise<UserProfile> {
  const token = await SecureStore.getItem("token");
  const { data } = await axios.get(`${EXPO_API}/v1/user/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}
