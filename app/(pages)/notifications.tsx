import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

type NotificationItem = {
  id: string;
  type: "accepted" | "expired" | "success" | "failed" | "orderSuccess";
  title: string;
  subtitle: string;
  date: string;
  amount?: number;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // mock data (แทน API)
    setNotifications([
      {
        id: "1",
        type: "accepted",
        title: "Deliver Accepted Order",
        subtitle: "กำลังจัดส่ง",
        date: "20 ส.ค. 2025",
      },
      {
        id: "2",
        type: "expired",
        title: "Order Expired",
        subtitle: "no rider available",
        date: "20 ส.ค. 2025",
      },
      {
        id: "3",
        type: "success",
        title: "Delivery Success",
        subtitle: "จัดส่งสำเร็จ",
        date: "20 ส.ค. 2025",
      },
      {
        id: "4",
        type: "failed",
        title: "Delivery Failed",
        subtitle: "จัดส่งไม่สำเร็จ",
        date: "20 ส.ค. 2025",
      },
      {
        id: "5",
        type: "orderSuccess",
        title: "Order Success",
        subtitle: "+ ฿ 150",
        date: "20 ส.ค. 2025",
      },
    ]);
  }, []);

  const getIconAndColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "accepted":
        return { icon: "delivery-dining", bg: Colors.secondary, color: "#fff" };
      case "expired":
        return { icon: "schedule", bg: Colors.red, color: "#fff" };
      case "success":
        return { icon: "check-circle", bg: Colors.green, color: "#fff" };
      case "failed":
        return { icon: "cancel", bg: Colors.red, color: "#fff" };
      case "orderSuccess":
        return { icon: "attach-money", bg: Colors.green, color: "#fff" };
      default:
        return { icon: "notifications", bg: Colors.gray1, color: "#fff" };
    }
  };

  const handleAction = (item: NotificationItem) => {
    if (item.type === "orderSuccess") {
      router.push("/(tabs)/order");
    } else {
      router.push("/(pages)/menu");
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const { icon, bg, color } = getIconAndColor(item.type);
    return (
      <View style={[styles.card]}>
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <MaterialIcons name={icon as any} size={24} color={color} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
          <ThemedText type="default">{item.subtitle}</ThemedText>
          <ThemedText style={styles.date}>{item.date}</ThemedText>
        </View>
        <TouchableOpacity onPress={() => handleAction(item)}>
          <ThemedText style={styles.actionText}>
            {item.type === "orderSuccess" ? "Delivered again →" : "Order again →"}
          </ThemedText>
        </TouchableOpacity>
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
          data={notifications}
          keyExtractor={(item) => item.id}
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
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  date: {
    color: Colors.gray1,
    fontSize: 12,
    marginTop: 3,
  },
  actionText: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: "600",
  },
});
