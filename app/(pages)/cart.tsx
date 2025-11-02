import { getMenubyId, Menu } from "@/api/store";
import CartItem from "@/components/CartItem";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useCart } from "@/store/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function CartPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    items,
    totalItems,
    updateQuantity: setQuantity,
    removeFromCart,
  } = useCart();

  const [cartDetails, setCartDetails] = useState<
    (Menu & { quantity: number })[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartDetails = async () => {
      const detailedItems = await Promise.all(
        items.map(async (item) => {
          const menu = await getMenubyId(item.menu_id);
          return { ...menu, quantity: item.quantity };
        })
      );
      setCartDetails(detailedItems);
      const total = detailedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    };

    fetchCartDetails();
  }, [items]);

  const deliveryFee = 10;
  const total = totalPrice + deliveryFee;

  const handleCheckout = () => {
    // Navigate to checkout or order confirmation page
    console.log("Checkout");
  };

  if (items.length === 0) {
    return (
      <LinearGradient
        colors={Colors.bg as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.emptyContainer}>
          <View style={styles.emptyContent}>
            <Ionicons name="cart-outline" size={100} color={Colors.gray1} />
            <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={Colors.bg as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.storeHeader}>
            <ThemedText style={styles.storeName}>
              {items[0]?.storeName || "Your Order"}
            </ThemedText>
            <View style={styles.itemCountBadge}>
              <ThemedText style={styles.itemCountText}>{totalItems}</ThemedText>
            </View>
            <ThemedText style={styles.itemCountLabel}>items</ThemedText>
          </View>

          <FlatList
            data={cartDetails}
            keyExtractor={(item) => item.menu_id}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                updateQuantity={(id, delta) => {
                  const curr =
                    items.find((i) => i.menu_id === id)?.quantity ?? 0;
                  setQuantity(id, curr + delta);
                }}
                deleteItem={(id) => removeFromCart(id)}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />

          <View
            style={[styles.summaryContainer, { paddingBottom: insets.bottom }]}
          >
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
              <ThemedText style={styles.summaryValue}>฿{totalPrice}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Delivery fee</ThemedText>
              <ThemedText style={styles.summaryValue}>
                ฿{deliveryFee}
              </ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryTotalLabel}>Total</ThemedText>
              <ThemedText style={styles.summaryTotalValue}>฿{total}</ThemedText>
            </View>
            <ThemedButton
              title="ยืนยันคำสั่งซื้อ"
              onPress={handleCheckout}
              variant="primary"
              style={{ width: "100%", marginTop: 10 }}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.gray1,
    marginTop: 20,
    fontWeight: "600",
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "transparent",
  },
  storeName: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  itemCountBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  itemCountText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  itemCountLabel: {
    fontSize: 16,
    color: Colors.gray1,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  summaryContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    paddingBottom: 30, // Extra padding for home indicator
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.gray1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 15,
  },
  summaryTotalLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
});
