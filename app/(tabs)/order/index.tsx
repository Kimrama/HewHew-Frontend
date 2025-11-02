import { getCanteens, getDropoffs, getOrder } from "@/api/order";
import { OrderCard } from "@/components/OrderInListCard";
import { SearchBar } from "@/components/SearchBar";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
} from "react-native";
import { HorizontalTags } from "@/components/HorizontalTags";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SearchOrderPage() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [dropoffs, setDropoffs] = useState<DropOff[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);
  const [selectedDropoff, setSelectedDropoff] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [orderRes, canteenRes, dropoffRes] = await Promise.all([
          getOrder(),
          getCanteens(),
          getDropoffs(),
        ]);
        setOrders(orderRes);
        setCanteens(canteenRes);
        setDropoffs(dropoffRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === id ? null : id);
  };

  // ✅ Filtering logic
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.shop_name.toLowerCase().includes(searchText.toLowerCase()) ||
      order.canteen_name.toLowerCase().includes(searchText.toLowerCase());
    const matchCanteen = selectedCanteen ? order.canteen_name === selectedCanteen : true;
    const matchDropoff = selectedDropoff ? order.drop_off_location_id === selectedDropoff : true;
    return matchSearch && matchCanteen && matchDropoff;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#FAE9E8", "#FFFFFF"]} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* 🔍 Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search Store or Canteen"
            value={searchText}
            onChangeText={setSearchText}
            style={{ marginBottom: 20 }}
          />
        </View>

        {/* 🏫 จุดรับอาหาร */}
        <ThemedText style={styles.sectionTitle}>จุดรับอาหาร</ThemedText>
        <HorizontalTags
          tags={canteens.map((c) => c.CanteenName)}
          selectedTag={selectedCanteen}
          onPressTag={(tag) =>
            setSelectedCanteen(selectedCanteen === tag ? null : tag)
          }
        />

        {/* 📍 จุดส่งอาหาร */}
        <ThemedText style={[styles.sectionTitle, { marginTop: 10 }]}>จุดส่งอาหาร</ThemedText>
        <HorizontalTags
          tags={dropoffs.map((d) => d.name)}
          selectedTag={
            dropoffs.find((d) => d.dropoff_id === selectedDropoff)?.name ?? null
          }
          onPressTag={(tag) => {
            const drop = dropoffs.find((d) => d.name === tag);
            if (drop) {
              setSelectedDropoff(selectedDropoff === drop.dropoff_id ? null : drop.dropoff_id);
            }
          }}
        />

        {/* 📦 ผลลัพธ์ */}
        <ThemedText style={[styles.sectionTitle, { marginTop: 30 }]}>
          ผลลัพธ์ ({filteredOrders.length})
        </ThemedText>

        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.order_id}
              order={order}
              isExpanded={expanded === order.order_id}
              onToggle={() => toggleExpand(order.order_id)}
            />
          ))
        ) : (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <ThemedText>ไม่พบออเดอร์ที่ตรงกับเงื่อนไข</ThemedText>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.confirmButton}>
        <ThemedButton
          title={"เริ่มการจัดส่ง"}
          variant="primary"
          onPress={() => router.push("/(tabs)/order/confirmOrder")}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  searchContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontWeight: "600", marginBottom: 8, color: "#3FA268" },
  confirmButton: {
    marginTop: 20,
    alignItems: "center",
    marginVertical: 30,
    position: "absolute",
    left: 30,
    bottom: 80,
  },
});
