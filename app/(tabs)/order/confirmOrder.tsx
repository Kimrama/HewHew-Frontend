import { DropOff, Order, User, acceptOrderbyRider, getOrderbyId } from "@/api/order";
import { OrderBlock } from "@/components/OrderBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useOrderContext } from "@/store/order-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConfirmOrder() {
  const { acceptedOrders, removeOrder, acceptOrder } = useOrderContext();
  const [orders, setOrders] = useState<(Order & { 
    User?: User; 
    menus: { name: string; detail: string; price: number; quantity: number }[]; 
    totalQuantity: number; 
    dropOffLocation?: DropOff;
  })[]>([]);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      const enrichedOrders: typeof orders = [];
      for (const order of acceptedOrders) {
        try {
          const fullOrder = await getOrderbyId(order.order_id);
          enrichedOrders.push(fullOrder);
        } catch (err) {
          console.error("Error fetching order details:", err);
        }
      }
      setOrders(enrichedOrders);
    };

    fetchAcceptedOrders();
  }, [acceptedOrders]);

  const calculateTotalPrice = () => {
    return orders.reduce(
      (total, order) => total + order.shipping_fee,
      0
    );
  };

  const handleRemoveOrder = (orderId: string) => {
    Alert.alert(
      "Remove Order",
      "Are you sure you want to remove this order from your accepted list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeOrder(orderId);
            if (acceptedOrders.length === 1) router.back();
          },
        },
      ]
    );
  };

  const handleConfirmDelivery = () => {
    if (orders.length === 0) {
      Alert.alert("No Orders", "You haven't accepted any orders yet.");
      return;
    }

    Alert.alert(
      "Confirm Delivery",
      `Are you sure you want to start delivery for ${orders.length} orders?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              for (const o of acceptedOrders) {
                console.log(o.order_id)
                await acceptOrderbyRider(o.order_id);
              }
              Alert.alert("Success", "Delivery started successfully!");
              router.push("/(pages)/myDelivery");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to accept order.");
            }
          }
        },
      ]
    );
  };

  const renderItem = ({
    item,
    index,
    onRemove,
  }: {
    item: typeof orders[number];
    index: number;
    onRemove: (orderId: string) => void;
  }) => (
    <OrderBlock
      key={item.order_id}
      store={item.shop_name}
      amount={item.totalQuantity}
      canteen={item.canteen_name}
      menus={item.menus}
      orderPrice={item.amount}
      name={item.User?.username ?? "Unknown"}
      address={item.dropOffLocation?.name ?? ""}
      addressDetail={item.dropOffLocation?.detail ?? ""}
      deliveryMethod={item.delivery_method}
      appointmentTime={item.appointment_time}
      riderEarn={item.shipping_fee}
      index={index + 1}
      type="confirmOrder"
      onRemove={() => onRemove(item.order_id)}
      confirmImage=""
    />
  );


  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 31, paddingTop: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {acceptedOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No accepted orders</Text>
            <Text style={styles.emptySubtext}>
              Go back to accept some orders first
            </Text>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Back to Orders</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Header */}
            <View style={{paddingBottom: 10}}>
              <View style={[styles.row, { justifyContent: "space-between", }]}>
                <View style={styles.canteen}>
                  <ThemedText>{acceptedOrders[0].canteen_name}</ThemedText>
                </View>
              </View>
            </View>

            {/* List items */}
            {acceptedOrders.map((order, index) => (
              <View key={order.order_id}>
                {renderItem({ item: order, index, onRemove: handleRemoveOrder, })}
                {index !== acceptedOrders.length - 1 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: Colors.gray1 ?? "#E0E0E0",
                      marginVertical: 10,
                    }}
                  />
                )}
              </View>
            ))}

            {/* Summary */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Total Orders:</ThemedText>
                <ThemedText type='defaultSemiBold' style={{ fontSize: 16, color: Colors.primary }}>
                  {acceptedOrders.length}
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Total Earnings:</ThemedText>
                <ThemedText type='defaultSemiBold' style={{ fontSize: 16, color: Colors.primary }}>
                  ฿{calculateTotalPrice()}
                </ThemedText>
              </View>
            </View>

            {/* Confirm button */}
            <ThemedButton
              title={`ยืนยันการจัดส่ง (${acceptedOrders.length} รายการ)`}
              variant="primary"
              onPress={handleConfirmDelivery}
            />
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  ordersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  orderId: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    backgroundColor: "#ff4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 16,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderInfo: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  summarySection: {
    backgroundColor: "#f0f8ff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#333",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  buttonContainer: {
    marginTop: 12,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
    row: {
    flexDirection: "row",
    alignItems: "center",
  },
  canteen: {
    height: 25,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: Colors.white,
  },
  button: {
    marginVertical: 30,
    position: "absolute",
    left: 30,
    bottom: 30,
  },
});
function onRemove(order_id: string): void {
  throw new Error("Function not implemented.");
}

