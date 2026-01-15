import { getUser } from "@/api/order";
import { getReceivedReviews, mapReviewWithUsers } from "@/api/review";
import { RatingStars } from "@/components/RatingStars";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/store/auth-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";

const screenHeight = Dimensions.get("window").height;

const ProfileScreen = () => {
  const router = useRouter();
  const { isAuthenticated, logout, token } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, router]);

  // fetch profile and reviews
  const fetchData = async () => {
    if (!isAuthenticated || !token) return;

    try {
      const profileData = await getUser();
      setUserProfile(profileData);

      const receivedReviewsRaw = (await getReceivedReviews()) || []; // ✅ ถ้า null ให้เป็น array ว่าง
      const formattedReviews = await mapReviewWithUsers(receivedReviewsRaw || []); // safety

      const receivedOnly = Array.isArray(formattedReviews)
        ? formattedReviews.filter((r: any) => r.otherUser === profileData.username)
        : [];

      const avg =
        receivedOnly.length > 0
          ? receivedOnly.reduce((sum: number, r: any) => sum + r.rating, 0) /
          receivedOnly.length
          : 0;

      setAverageRating(avg);
      setWalletBalance(Number(profileData.wallet || 0)); // แปลงเป็น number
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
      setLoading(false);
    }
  };

  // Use useFocusEffect to refetch data every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [isAuthenticated, token]) // Re-run whenever authentication status or token changes
  );

  const handleLogOut = () => {
    logout();
    router.replace("/(auth)/login");
  };


  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!isAuthenticated) return null; // fallback

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

      <View style={styles.headerWrapper}>
        <View style={styles.curvedHeader} />
        <Pressable onPress={handleLogOut} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: userProfile?.profile_image_url || "https://i.pravatar.cc/100",
          }}
          style={styles.avatarCircle}
        />
      </View>

      {/* Username */}

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


      <ThemedText style={styles.fullName}>
        {userProfile?.fname} {userProfile?.lname}
      </ThemedText>


      {/* Edit Profile */}
      <Pressable style={styles.editButton} onPress={() => router.push("/editProfile")}>
        <ThemedText style={styles.editThemedText}>Edit Profile</ThemedText>
      </Pressable>

      {/* Rating */}
      <Pressable
        onPress={() => router.push("/rating")}
        style={{ alignItems: "center", marginBottom: 20 }}
      >
        <ThemedText style={styles.ratingThemedText}>
          {averageRating ? averageRating.toFixed(1) : "0.0"}
          <ThemedText style={{ color: "#ccc" }}>/5</ThemedText>
        </ThemedText>
        <RatingStars rating={averageRating || 0} size={24} />
      </Pressable>

      {/* Wallet */}
      <View style={styles.walletBox}>
        <View style={styles.walletRow}>
          <MaterialIcons
            name="account-balance-wallet"
            size={26}
            color={Colors.primary}
          />
          <ThemedText style={styles.walletAmount}>฿ {walletBalance}</ThemedText>
        </View>
        <Pressable style={styles.walletButton} onPress={() => router.push("/(tabs)/payment")}>
          <ThemedText style={styles.walletButtonThemedText}>Add Wallet</ThemedText>
        </Pressable>
      </View>

      {/* Orders and Delivery Cards */}
      <View style={{ width: "80%" }}>
        <Pressable
          style={styles.card}
          onPress={() => router.push("/(pages)/myOrder")}
        >
          <View style={styles.row}>
            <MaterialIcons name="list-alt" size={26} color={Colors.primary} />
            <View style={{ marginLeft: 10 }}>
              <ThemedText type="subtitle">My Orders</ThemedText>
              <Text style={styles.desc}>View your order history and details</Text>

            </View>
          </View>
          <MaterialIcons name="chevron-right" size={26} color={Colors.primary} />
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/(pages)/myDelivery")}
        >
          <View style={styles.row}>
            <MaterialIcons name="delivery-dining" size={26} color={Colors.primary} />
            <View style={{ marginLeft: 10 }}>
              <ThemedText type="subtitle">My Deliveries</ThemedText>
              <Text style={styles.desc}>Confirm and track delivery status</Text>

            </View>
          </View>
          <MaterialIcons name="chevron-right" size={26} color={Colors.primary} />
        </Pressable>
      </View>
    </View>
  );
};

export default ProfileScreen;



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary, alignItems: "center" },
  headerWrapper: { width: "100%", height: 160, backgroundColor: "transparent", position: "relative", zIndex: 0 },
  curvedHeader: { position: "absolute", top: 150, width: "100%", height: screenHeight, backgroundColor: Colors.white, borderTopLeftRadius: 180, borderTopRightRadius: 180 },
  logoutButton: { position: "absolute", top: 20, right: 20, padding: 10, backgroundColor: Colors.white, borderRadius: 50, elevation: 3 },
  avatarContainer: { marginTop: -70, marginBottom: 15, zIndex: 2 },
  avatarCircle: { width: 150, height: 150, borderRadius: 80, backgroundColor: "#aaa" },
  username: { fontWeight: "bold", fontSize: 24 },
  fullName: { color: "gray", fontSize: 16, marginBottom: 16 },
  editButton: { backgroundColor: Colors.green, paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  editThemedText: { color: "#fff", fontWeight: "bold" },
  ratingThemedText: { fontSize: 16, marginBottom: 8 },
  walletBox: { backgroundColor: "#FDE1D5", width: "80%", padding: 16, alignItems: "flex-end", alignSelf: "center", borderRadius: 12, marginBottom: 12, elevation: 2 },
  walletRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 10 },
  walletAmount: { fontSize: 18, marginBottom: 10, textAlign: "right" },
  walletButton: { backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 20, paddingVertical: 5, borderWidth: 1, borderColor: "#aaa" },
  walletButtonThemedText: { color: "#000" },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#ddd", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  desc: { color: "#555", fontSize: 12 },
});
