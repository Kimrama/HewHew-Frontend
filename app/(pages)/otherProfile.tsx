import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { RatingStars } from "@/components/RatingStars";
import { OtherReviewCard } from "@/components/OtherReviewCard";
import { getUserbyId } from "@/api/order";
import { getReceivedReviews, mapReviewWithUsers } from "@/api/review";

const screenHeight = Dimensions.get("window").height;

export default function OtherProfileScreen() {
  const { userId } = useLocalSearchParams(); // ✅ รับค่า userId จาก route parameter
  const [userProfile, setUserProfile] = useState<any>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;

        // ✅ ดึงข้อมูลผู้ใช้
        const profile = await getUserbyId(userId as string);
        setUserProfile(profile);

        // ✅ ดึงรีวิวทั้งหมด แล้วกรองเฉพาะที่ target คือ userId นี้
        const allReviews = await getReceivedReviews();
        const filteredReviews = allReviews.filter(
          (r) => r.user_target_id === userId
        );

        // ✅ รวมข้อมูล user ที่รีวิวมาแต่ละคน
        const formattedReviews = await mapReviewWithUsers(filteredReviews);
        setReviews(formattedReviews);

        // ✅ คำนวณค่าเฉลี่ยคะแนนเอง
        const avg =
          formattedReviews.length > 0
            ? formattedReviews.reduce((sum, r) => sum + r.rating, 0) /
              formattedReviews.length
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

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* รีวิวที่ได้รับ */}
      <FlatList
        data={reviews}
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
            userId={item.user_reviewer_id} // ✅ ส่ง userId ของคนรีวิวไป เพื่อกดเข้าโปรไฟล์ได้
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: "center",
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
});
