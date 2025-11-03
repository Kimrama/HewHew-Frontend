import { getUserbyId } from "@/api/order";
import { getUserReviews, mapReviewWithUsers } from "@/api/review"; // ✅ เปลี่ยนตรงนี้
import { OtherReviewCard } from "@/components/OtherReviewCard";
import { RatingStars } from "@/components/RatingStars";
import SortTabs from "@/components/SortTabs";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
  const { userId } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;

        //  ดึงข้อมูลโปรไฟล์ของ userId
        const profile = await getUserbyId(userId as string);
        setUserProfile(profile);

        // ดึงรีวิวที่ผู้ใช้นี้ได้รับ
        let receivedReviews = await getUserReviews(userId as string);

        if (!Array.isArray(receivedReviews)) {
          console.warn("รูปแบบข้อมูลรีวิวไม่ถูกต้อง");
          receivedReviews = [];
        }

        //  map reviewer info ให้ครบ
        const formattedReviews = await mapReviewWithUsers(receivedReviews);
        setReviews(formattedReviews);

        // คำนวณค่าเฉลี่ยคะแนน
        const avg =
          formattedReviews.length > 0
            ? formattedReviews.reduce((sum, r) => sum + r.rating, 0) / formattedReviews.length
            : 0;
        setAverageRating(avg);
      } catch (err) {
        console.error("Error loading profile data:", err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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
  const getGenderColor = (gender: string) => {
    if (gender.toLowerCase() === "male") {
      return "#2567ecff"; // กำหนดสีฟ้าให้ชาย
    } else if (gender.toLowerCase() === "female") {
      return "#f147b2ff"; // กำหนดสีชมพูให้หญิง
    }
    return "#888"; 
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ alignItems: "center" }}>
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

         <ThemedText style={styles.username}>
                {userProfile?.username || "username"}{" "}
                <Text
                  style={{
                    color: getGenderColor(userProfile?.gender || ""),
                    fontWeight: "bold",
                  }}
                >
                  {userProfile?.gender?.toLowerCase() === "male"
                    ? "♂"
                    : userProfile?.gender?.toLowerCase() === "female"
                    ? "♀"
                    : ""}
                </Text>
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
        <ThemedText style={styles.noReviewsText}>ยังไม่มีรีวิว</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green,
  },
  headerWrapper: {
    width: "100%",
    height: 100,
    backgroundColor: "transparent",
    position: "relative",
    zIndex: 0,
  },
  curvedHeader: {
    position: "absolute",
    top: 100,
    width: "100%",
    height: screenHeight,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
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
