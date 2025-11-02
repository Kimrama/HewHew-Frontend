import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getUser } from "./order"; // ใช้ดึงข้อมูล user เพิ่มเติม
import EXPO_API from "./url"; // เชื่อมกับ URL ของ API ของคุณ

export async function topUpWallet(amount: number): Promise<string> {
  try {
    const token = await SecureStore.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    // สร้างข้อมูลที่จะส่งไปยัง API
    const formData = {
      amount: amount, // จำนวนเงินที่ต้องการเติม
    };

    // เรียก API เพื่อเติมเงินเข้ากระเป๋า
    const { data } = await axios.put(
      `${EXPO_API}/v1/user/topup`, // API สำหรับเติมเงิน
      formData,
      {
        headers: {
          "Content-Type": "application/json", // เปลี่ยนเป็น JSON
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.message === "Topup successfully") {
      return "เติมเงินสำเร็จ";
    } else {
      throw new Error("การเติมเงินไม่สำเร็จ");
    }
  } catch (error) {
    console.error("Failed to top-up wallet:", error);
    throw error; // หากเกิดข้อผิดพลาดให้โยน error ออกไป
  }
}


// ฟังก์ชันตรวจสอบยอดเงินในกระเป๋าผู้ใช้
export async function getWalletBalance(): Promise<number> {
  try {
    const user = await getUser(); // ดึงข้อมูลผู้ใช้

    return user.wallet; // คืนค่ากระเป๋าเงินจากข้อมูลผู้ใช้
  } catch (error) {
    console.error("Failed to fetch wallet balance:", error);
    throw error; // หากเกิดข้อผิดพลาดให้โยน error ออกไป
  }
}
