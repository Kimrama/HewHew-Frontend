import { UserSignIn, singInResponse } from "@/types/user";
import { EXPO_API } from "@env";
import axios from "axios";

export async function signIn(userData: UserSignIn): Promise<singInResponse> {
  const { data } = await axios.post(`${EXPO_API}/v1/user/login`, userData);
  return data;
}
