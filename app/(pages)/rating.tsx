import { getUser } from "@/api/order";
import {
  getReceivedReviews,
  getWrittenReviews,
  mapReviewWithUsers,
} from "@/api/review";
import { OtherReviewCard } from "@/components/OtherReviewCard";
import { RatingBreakdown } from "@/components/RatingBreakdown";
import { RatingStars } from "@/components/RatingStars";
import { ReviewCard } from "@/components/ReviewCard";
import ReviewTabs from "@/components/ReviewTabs";
import SortTabs from "@/components/SortTabs";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

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

export default function RatingScreen() {
  const [writtenReviews, setWrittenReviews] = useState<Review[]>([]);
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedTab, setSelectedTab] = useState<"yourReviews" | "receivedReviews">("yourReviews");
  const [sortOption, setSortOption] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");

  const handleEdit = (id: string) => console.log("Edit review", id);
  const handleRemove = (id: string) =>
    setWrittenReviews((current) => current.filter((r) => r.id !== id));

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const userData = await getUser();
        setUserProfile(userData);

        // ✅ ดึงรีวิวที่เราเขียน และรีวิวที่เราได้รับ
        const rawWrittenReviews = await getWrittenReviews();
        const rawReceivedReviews = await getReceivedReviews();

        const formattedWrittenReviews = await mapReviewWithUsers(rawWrittenReviews);
        const formattedReceivedReviews = await mapReviewWithUsers(rawReceivedReviews);

        setWrittenReviews(formattedWrittenReviews);
        setReceivedReviews(formattedReceivedReviews);

        // ✅ คำนวณค่าเฉลี่ยเฉพาะรีวิวที่เราได้รับ
        const avg =
          formattedReceivedReviews.length > 0
            ? formattedReceivedReviews.reduce((sum, r) => sum + r.rating, 0) /
              formattedReceivedReviews.length
            : 0;
        setAverageRating(avg);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setWrittenReviews([]);
        setReceivedReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // เลือกรีวิวตามแท็บ
  const activeReviews =
    selectedTab === "yourReviews" ? writtenReviews : receivedReviews;

  // ฟังก์ชันจัดเรียง
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

  const sortedReviews = sortReviews(activeReviews);

  if (loading) {
    return (
      <LinearGradient
        colors={Colors.bg}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <ThemedText style={{ marginTop: 12 }}>กำลังโหลดข้อมูลรีวิว...</ThemedText>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Colors.bg} style={{ flex: 1 }}>
      {/* ✅ ส่วนหัว แสดงเฉพาะรีวิวที่เราได้รับ */}
      <View style={styles.rowContainer}>
        <RatingBreakdown reviews={receivedReviews} />
        <View style={styles.headContainer}>
          <ThemedText style={styles.summaryText}>
            {averageRating ? averageRating.toFixed(1) : "0.0"}
            <ThemedText style={{ color: "#7f7272ff" }}>/5</ThemedText>
          </ThemedText>
          <RatingStars rating={averageRating ?? 0} size={16} />
          <ThemedText style={styles.summaryText}>
            {`${receivedReviews.length} Ratings`}
          </ThemedText>
        </View>
      </View>

      {/* Tabs */}
      <ReviewTabs selected={selectedTab} setSelected={setSelectedTab} />
      <SortTabs sortOption={sortOption} setSortOption={setSortOption} />

      {/* รีวิว */}
      {sortedReviews.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ThemedText style={{ fontSize: 16, color: "#777" }}>ยังไม่มีรีวิว</ThemedText>
        </View>
      ) : (
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
      )}
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
