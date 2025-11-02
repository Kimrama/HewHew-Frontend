import { getUserbyId } from "@/api/order";
import { getWrittenReviews, mapReviewWithUsers } from "@/api/review";
import { OtherReviewCard } from "@/components/OtherReviewCard";
import { RatingStars } from "@/components/RatingStars";
import SortTabs from "@/components/SortTabs";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";


const screenHeight = Dimensions.get("window").height;

interface Review {
  id: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  otherUser: string;
  otherUserId: string;
  otherUserAvatarUrl?: string;
  date: string;
  user_reviewer_id: string;
}

export default function OtherProfileScreen() {
  const { userId } = useLocalSearchParams(); // รับค่า userId จาก route parameter
  const [userProfile, setUserProfile] = useState<any>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<"yourReviews" | "receivedReviews">("yourReviews");
  const [sortOption, setSortOption] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");


  useEffect(() => {
    const fetchData = async () => {
  try {
    if (!userId) return;

    // ดึงข้อมูลโปรไฟล์ของ userId
    const profile = await getUserbyId(userId as string);
    setUserProfile(profile);

    // ดึงรีวิวทั้งหมด
    let allReviews = await getWrittenReviews();

    // ตรวจสอบว่า allReviews เป็น null หรือไม่
    if (allReviews === null) {
      allReviews = [];  // กำหนดให้เป็นอาร์เรย์ว่าง
      console.warn("ไม่มีข้อมูลรีวิวสำหรับผู้ใช้นี้");
    }
    console.log("All reviews fetched:", allReviews);
    // ตรวจสอบว่า allReviews เป็นอาร์เรย์หรือไม่
    if (!Array.isArray(allReviews)) {
      throw new Error("ข้อมูลรีวิวไม่ถูกต้อง");
    }

    // กรองเฉพาะรีวิวที่ target เป็น userId นี้
    const filteredReviews = allReviews.filter(
      (r) => r.user_target_id === userId
    );

    // map reviewer info ให้ครบ
    const formattedReviews = await mapReviewWithUsers(filteredReviews);
    setReviews(formattedReviews);

    // คำนวณค่าเฉลี่ยคะแนน
    const avg =
      formattedReviews.length > 0
        ? formattedReviews.reduce((sum, r) => sum + r.rating, 0) / formattedReviews.length
        : 0;
    setAverageRating(avg);
  } catch (err) {
    console.error(err);
    setError("ไม่สามารถโหลดข้อมูลได้");
  } finally {
    setLoading(false);
  }
};


    fetchData();
  }, [userId]);
  console.log("User Profile:", userId);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  const sortReviews = (data: Review[]) => {
    switch (sortOption) {
      case "latest":
        return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "oldest":
        return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "highest":
        return [...data].sort((a, b) => b.rating - a.rating);
      case "lowest":
        return [...data].sort((a, b) => a.rating - b.rating);
      default:
        return data;
    }
  };

  const sortedReviews = sortReviews(reviews);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ alignItems: "center", }} >
        <View style={styles.headerWrapper}>
          <View style={styles.curvedHeader} />
        </View>

        {/* Profile Image */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: userProfile?.profile_image_url || "https://i.pravatar.cc/150",
            }}
            style={styles.avatarCircle}
          />
        </View>

        {/* Username */}
        <ThemedText style={styles.username}>
          {userProfile?.username || "username"}{" "}
          {userProfile?.gender === "male" ? "♂" : "♀"}
        </ThemedText>

        {/* Full name */}
        <ThemedText style={styles.fullName}>
          {userProfile?.fname} {userProfile?.lname}
        </ThemedText>
      </View>

      {/* Rating */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <ThemedText style={styles.ratingText}>
          {averageRating ? averageRating.toFixed(1) : "0.0"}
          <ThemedText style={{ color: "#ccc" }}>/5</ThemedText>
        </ThemedText>
        <RatingStars rating={averageRating || 0} size={22} />
        <ThemedText style={styles.ratingCount}>
          {reviews.length} Ratings
        </ThemedText>
      </View>
      <SortTabs sortOption={sortOption} setSortOption={setSortOption} />


      {/* รีวิวที่ได้รับ */}
      {reviews.length > 0 ? (
        <FlatList
          data={sortedReviews}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <OtherReviewCard
              id={item.id}
              username={item.username}
              rating={item.rating}
              comment={item.comment}
              date={item.date}
              avatarUrl={item.avatarUrl}
              userId={item.user_reviewer_id} // สำหรับกดเข้าโปรไฟล์ reviewer
            />
          )}
        />
      ) : (
        <ThemedText style={styles.noReviewsText} >ยังไม่มีรีวิว</ThemedText> // หากไม่มีรีวิวให้แสดงข้อความนี้
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,

  },
  headerWrapper: {
    width: "100%",
    height: 160,
    backgroundColor: "transparent",
    position: "relative",
    zIndex: 0,
  },
  curvedHeader: {
    position: "absolute",
    top: 150,
    width: "100%",
    height: screenHeight,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
  },
  avatarContainer: {
    marginTop: -70,
    marginBottom: 15,
    zIndex: 2,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: "#aaa",
  },
  username: {
    fontWeight: "bold",
    fontSize: 22,
  },
  fullName: {
    color: "gray",
    fontSize: 16,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 6,
  },
  ratingCount: {
    fontSize: 14,
    color: "gray",
  },
  noReviewsText: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.gray1,
    marginTop: 20,
  },
});
