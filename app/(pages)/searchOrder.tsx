import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { SearchBar } from "@/components/SearchBar";
import { OrderCard } from "@/components/OrderInListCard";
import { getOrder, getCanteens, getDropoffs } from "@/api/order";

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

        {/* 🏫 จุดรับ */}
        <ThemedText style={styles.sectionTitle}>จุดรับอาหาร</ThemedText>
        <View style={styles.filterRow}>
          {canteens.map((c) => (
            <Pressable
              key={c.CanteenName}
              style={[
                styles.filterBtn,
                selectedCanteen === c.CanteenName && styles.filterActive,
              ]}
              onPress={() =>
                setSelectedCanteen(selectedCanteen === c.CanteenName ? null : c.CanteenName)
              }
            >
              <ThemedText
                style={[
                  styles.filterThemedText,
                  selectedCanteen === c.CanteenName && styles.filterThemedTextActive,
                ]}
              >
                {c.CanteenName}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* 📍 จุดส่ง */}
        <ThemedText style={[styles.sectionTitle, { marginTop: 20 }]}>จุดส่งอาหาร</ThemedText>
        <View style={styles.filterRow}>
          {dropoffs.map((d) => (
            <Pressable
              key={d.dropoff_id}
              style={[
                styles.filterBtn,
                selectedDropoff === d.dropoff_id && styles.filterActive,
              ]}
              onPress={() =>
                setSelectedDropoff(selectedDropoff === d.dropoff_id ? null : d.dropoff_id)
              }
            >
              <ThemedText
                style={[
                  styles.filterThemedText,
                  selectedDropoff === d.dropoff_id && styles.filterThemedTextActive,
                ]}
              >
                {d.name}
              </ThemedText>
            </Pressable>
          ))}
        </View>

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
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  searchContainer: {
      
    alignItems: "center",   
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  backBtn: { marginBottom: 10 },
  sectionTitle: { fontWeight: "600", marginBottom: 8, color: "#3FA268" },
  filterRow: { flexDirection: "row", flexWrap: "wrap" },
  filterBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    elevation: 1,
  },
  filterActive: { backgroundColor: "#3FA268" },
  filterThemedText: { color: "#3FA268", fontWeight: "500" },
  filterThemedTextActive: { color: "#fff" },
});
