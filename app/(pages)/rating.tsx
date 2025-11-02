import { OtherReviewCard } from "@/components/OtherReviewCard";
import { RatingBreakdown } from "@/components/RatingBreakdown";
import { RatingStars } from "@/components/RatingStars";
import { ReviewCard } from "@/components/ReviewCard";
import ReviewTabs from "@/components/ReviewTabs";
import SortTabs from "@/components/SortTabs";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator } from "react-native";
import {
  getAverageRating,
  getReceivedReviews,
  getWrittenReviews,
  mapReviewWithUsers,
} from "@/api/review";
import { getUser } from "@/api/order";

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
}

export default function RatingScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<
    "yourReviews" | "receivedReviews"
  >("yourReviews");

  const [sortOption, setSortOption] = useState<
    "latest" | "oldest" | "highest" | "lowest"
  >("latest");

  const handleEdit = (id: string) => {
    console.log("Edit review", id);
  };

  const handleRemove = (id: string) => {
    console.log("Remove review", id);
    setReviews((current) => current.filter((r) => r.id !== id));
  };

  // ✅ โหลดข้อมูลจาก API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // ดึงข้อมูล user ปัจจุบัน
        const userData = await getUser();
        setUserProfile(userData);

        // โหลดรีวิวตาม tab ที่เลือก
        const rawReviews =
          selectedTab === "yourReviews"
            ? await getWrittenReviews()
            : await getReceivedReviews();

        // แปลงข้อมูลให้พร้อมแสดงผล (ดึงชื่อและรูปจาก user id)
        const formattedReviews = await mapReviewWithUsers(rawReviews);
        setReviews(formattedReviews);

        // โหลดค่าเฉลี่ย
        const avg = await getAverageRating();
        setAverageRating(avg);
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
        setError("ไม่สามารถโหลดข้อมูลรีวิวได้");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [selectedTab]);

  // ✅ ฟังก์ชันจัดเรียงรีวิว
  const sortReviews = (data: Review[]) => {
    switch (sortOption) {
      case "latest":
        return [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "oldest":
        return [...data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "highest":
        return [...data].sort((a, b) => b.rating - a.rating);
      case "lowest":
        return [...data].sort((a, b) => a.rating - b.rating);
      default:
        return data;
    }
  };

  const sortedReviews = sortReviews(reviews);

  if (loading) {
    return (
      <LinearGradient
        colors={Colors.bg}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <ThemedText style={{ marginTop: 12 }}>กำลังโหลดข้อมูลรีวิว...</ThemedText>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={Colors.bg}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText>{error}</ThemedText>
      </LinearGradient>
    );
  }

  const receivedReviewsOnly = reviews.filter(
    (r) => r.otherUser === userProfile?.username
  );

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* ส่วนหัว */}
      <View style={styles.rowContainer}>
        <RatingBreakdown reviews={receivedReviewsOnly} />

        <View style={styles.headContainer}>
          <ThemedText style={styles.summaryText}>
            {averageRating ? averageRating.toFixed(1) : "0.0"}
            <ThemedText style={{ color: "#ccc" }}>/5</ThemedText>
          </ThemedText>
          <RatingStars rating={averageRating ?? 0} size={16} />
          <ThemedText style={styles.summaryText}>
            {`${receivedReviewsOnly.length} Ratings`}
          </ThemedText>
        </View>
      </View>

      {/* แถบเลือก tab */}
      <ReviewTabs selected={selectedTab} setSelected={setSelectedTab} />

      {/* แถบเลือกการจัดเรียง */}
      <SortTabs sortOption={sortOption} setSortOption={setSortOption} />

      {/* รายการรีวิว */}
      <FlatList
        data={sortedReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          selectedTab === "yourReviews" ? (
            <ReviewCard
              id={item.id}
              username={item.username}
              rating={item.rating}
              comment={item.comment}
              date={item.date}
              avatarUrl={item.avatarUrl}
              otherUser={item.otherUser}
              otherUserId={item.otherUserId}
              otherUserAvatarUrl={item.otherUserAvatarUrl}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
          ) : (
            <OtherReviewCard
              id={item.id}
              username={item.username}
              rating={item.rating}
              comment={item.comment}
              date={item.date}
              avatarUrl={item.avatarUrl}
              userId={item.user_reviewer_id}
            />
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  summaryText: {
    fontSize: 16,
    color: "#555",
    margin: 4,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 12,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
