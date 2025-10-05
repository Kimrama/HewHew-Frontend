import { UserSignIn, singInResponse } from "@/types/user";
import { EXPO_API } from "@env";
import axios from "axios";

export async function signIn(userData: UserSignIn): Promise<singInResponse> {
  console.log(EXPO_API);
  const { data } = await axios.post(`${EXPO_API}/v1/user/login`, userData);
  return data;
}
