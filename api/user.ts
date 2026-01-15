import axios from "axios";
import * as SecureStore from "expo-secure-store";
import EXPO_API from "./url";

export interface User {
  user_id: string;
  username: string;
  fname: string;
  lname: string;
  gender: string;
  profile_image_url: string | null;
  wallet: string;
}

// ✅ ดึงข้อมูลผู้ใช้
export const getUser = async (): Promise<User | null> => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const res = await axios.get(`${EXPO_API}/v1/user/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};

// ✅ อัปเดตข้อมูลชื่อ–นามสกุล–เพศ
export const updateUser = async (fname: string, lname: string, gender: string) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const res = await axios.put(
      `${EXPO_API}/v1/user/`,
      { fname, lname, gender },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};
// ✅ อัปโหลดรูปโปรไฟล์
export const updateProfileImage = async (uri: string) => {
  try {
    const token = await SecureStore.getItemAsync("token");

    // ✅ สร้าง FormData ให้ตรงกับ API (key ต้องชื่อ "Image")
    const formData = new FormData();
    formData.append("Image", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);

    const res = await axios.put(`${EXPO_API}/v1/user/profile_image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error updating profile image:", err);
    throw err;
  }
};
