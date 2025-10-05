import {
  singInResponse,
  singUpResponse,
  UserSignIn,
  UserSignUp,
} from "@/types/user";
import { EXPO_API } from "@env";
import axios from "axios";

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
