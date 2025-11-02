import { getNoti, getUser, Noti } from "@/api/order";
import { formatDateTime } from "@/components/StatusBlock";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/store/auth-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [noti, setNoti] = useState<Noti[]>([]);
  const { isAuthenticated, logout, token } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login.");
    return <Redirect href="/(auth)/login" />;
  }

  const notiMap: Record<string, "success" | "accepted" | "expired"> = {
    "Order Confirmed": "success",
    "Order Accepted": "accepted",
    Expired: "expired",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUser();
        setUser(response);
        console.log("user", response.user_id);
      } catch (err) {
        console.error(err);
      }
    };
    if (isAuthenticated && token) {
      fetchData();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    const fetchNoti = async () => {
      if (!user?.user_id) return;

      try {
        console.log("noti", user.user_id);
        const response = await getNoti(user.user_id);
        setNoti(Array.isArray(response) ? response : [response]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNoti();
  }, [user]);

  const getIconAndColor = (type: "accepted" | "expired" | "success") => {
    switch (type) {
      case "accepted":
        return { icon: "delivery-dining", bg: Colors.green, color: "#fff" };
      case "expired":
        return { icon: "schedule", bg: Colors.red, color: "#fff" };
      case "success":
        return { icon: "check-circle", bg: Colors.primary, color: "#fff" };
      default:
        return { icon: "notifications", bg: Colors.gray1, color: "#fff" };
    }
  };

  const handleAction = (type: "accepted" | "expired" | "success") => {
    if (type === "success") {
      router.push("/(tabs)/order");
    } else {
      router.push("/(pages)/menu");
    }
  };

  const renderItem = ({ item }: { item: Noti }) => {
    const type = notiMap[item.topic] ?? "success";
    const { icon, bg, color } = getIconAndColor(
      notiMap[item.topic] as "accepted" | "expired" | "success"
    );
    return (
      <View style={[styles.card]}>
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <MaterialIcons name={icon as any} size={40} color={color} />
        </View>
        <View style={{ flexDirection: "column" }}>
          <View style={styles.textContainer}>
            <ThemedText type="defaultSemiBold">{item.topic}</ThemedText>
            <ThemedText type="default">{item.message}</ThemedText>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 270,
            }}
          >
            <ThemedText style={styles.date}>
              {formatDateTime(item.time_stamp)}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <FlatList
          data={noti}
          keyExtractor={(item) => item.notification_id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={renderItem}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 15,
    marginVertical: 8,
    borderColor: Colors.gray2,
    borderWidth: 1,
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    width: 270,
  },
  date: {
    color: Colors.gray1,
    fontSize: 12,
    marginTop: 3,
  },
  actionText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
});
