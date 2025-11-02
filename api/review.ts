// api/review.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getUser, getUserbyId } from "./order"; // ใช้ดึงข้อมูล user เพิ่มเติม
import EXPO_API from "./url";

// --- Interfaces ---
export interface Review {
  review_id: string;
  user_reviewer_id: string;
  user_target_id: string;
  order_id: string;
  rating: number;
  comment: string;
  time_stamp: string;
}

export interface AverageRatingResponse {
  average_rating: number;
}

// --- ดึงรีวิวที่ user “ได้รับ” ---
export async function getReceivedReviews(): Promise<Review[]> {
  const token = await SecureStore.getItem("token");
  if (!token) throw new Error("Token not found");

  const user = await getUser();
  const userId = user?.user_id;
  if (!userId) throw new Error("ไม่พบ user_id");

  const { data } = await axios.get(`${EXPO_API}/v1/review/user/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return data; // array ของ review objects
}

// --- ดึงรีวิวที่ user “เขียนให้คนอื่น” ---
export async function getWrittenReviews(): Promise<Review[]> {
  const token = await SecureStore.getItem("token");
  if (!token) throw new Error("Token not found");

  const user = await getUser();
  const userId = user?.user_id;
  if (!userId) throw new Error("ไม่พบ user_id");

  const { data } = await axios.get(`${EXPO_API}/v1/review/reviewer/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

// --- ดึงค่าเฉลี่ยคะแนนรีวิวทั้งหมดของ user ปัจจุบัน ---
export async function getAverageRating(): Promise<number> {
  const token = await SecureStore.getItem("token");
  if (!token) throw new Error("Token not found");

  const { data } = await axios.get<AverageRatingResponse>(
    `${EXPO_API}/v1/review/averagerating`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data.average_rating || 0;
}

// --- เพิ่มรีวิวใหม่ ---
export async function postReview(
  user_target_id: string,
  order_id: string,
  rating: number,
  comment: string
): Promise<void> {
  const token = await SecureStore.getItem("token");
  if (!token) throw new Error("Token not found");

  await axios.post(
    `${EXPO_API}/v1/review`,
    {
      user_target_id,
      order_id,
      rating,
      comment,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// --- (ออปชัน) แปลง review พร้อมข้อมูลชื่อ user สำหรับแสดงผลใน UI ---
export async function mapReviewWithUsers(reviews: Review[]) {
  const result = await Promise.all(
    reviews.map(async (r) => {
      try {
        const reviewer = await getUserbyId(r.user_reviewer_id);
        const target = await getUserbyId(r.user_target_id);

        return {
          id: r.review_id,
          username: reviewer.username,
          avatarUrl: reviewer.profile_image_url,
          rating: r.rating,
          comment: r.comment,
          otherUser: target.username,
          otherUserId: target.user_id,
          otherUserAvatarUrl: target.profile_image_url,
          date: r.time_stamp,
          user_reviewer_id: reviewer.user_id,
        };
      } catch (err) {
        console.error("mapReviewWithUsers error:", err);
        return {
          id: r.review_id,
          username: "Unknown",
          avatarUrl: "",
          rating: r.rating,
          comment: r.comment,
          otherUser: "",
          otherUserId: "", 
          otherUserAvatarUrl: "",
          date: r.time_stamp,
          
        };
      }
    })
  );

  return result;
}
