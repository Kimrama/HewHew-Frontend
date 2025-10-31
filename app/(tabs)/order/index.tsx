import { getOrder, Order } from "@/api/order";
import { Colors } from "@/constants/Colors";
import { useOrderContext } from "@/store/order-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { acceptedOrders } = useOrderContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const calculateTotalEarnings = () => {
    return acceptedOrders.reduce(
      (total, order) => total + order.shipping_fee,
      0
    );
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await getOrder();
        // Filter out orders that are already accepted
        const availableOrders = fetchedOrders.filter(
          (order) =>
            !acceptedOrders.some(
              (accepted) => accepted.order_id === order.order_id
            )
        );
        setOrders(availableOrders);
      } catch (error) {
        console.log("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [acceptedOrders]); // Add acceptedOrders as dependency to re-filter when orders are accepted

  const renderOrderCard = (order: Order, isAccepted: boolean = false) => (
    <Pressable
      key={order.order_id}
      style={[styles.orderCard, isAccepted && styles.acceptedOrderCard]}
      onPress={() =>
        router.push(`/(tabs)/order/orderDetail?orderId=${order.order_id}`)
      }
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order #{order.order_id}</Text>
        <Text style={styles.orderPrice}>฿{order.shipping_fee}</Text>
      </View>
      <Text style={styles.shopName}>{order.canteen_name}</Text>
      <Text style={styles.itemCount}>{order.menu_quantity.length} items</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{
          paddingBottom: acceptedOrders.length > 0 ? 180 + insets.bottom : 20,
        }}
      >
        {/* {acceptedOrders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accepted Orders</Text>
            {acceptedOrders.map((order) => renderOrderCard(order, true))}
          </View>
        )} */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Orders</Text>
          {orders.length === 0 ? (
            <Text style={styles.noOrdersText}>No orders available</Text>
          ) : (
            orders.map((order) => renderOrderCard(order))
          )}
        </View>
      </ScrollView>

      {acceptedOrders.length > 0 && (
        <View
          style={[
            styles.bottomContainer,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Orders:</Text>
              <Text style={styles.summaryValue}>{acceptedOrders.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Earnings:</Text>
              <Text style={styles.summaryValue}>
                ฿{calculateTotalEarnings()}
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.startDeliveryButton}
            onPress={() => router.push("/(tabs)/order/confirmOrder")}
          >
            <Text style={styles.startDeliveryText}>
              เริ่มการจัดสั่ง ({acceptedOrders.length} รายการ)
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// function OrderList({ insets }: { insets: { bottom: number } }) {
//   const router = useRouter();
//   const { orders, selectOrder } = useOrders();

//   return (
//     <View style={[styles.container, { paddingBottom: 60 + insets.bottom }]}>
//       <Text style={styles.title}>Order</Text>

//       {orders.map((order) => (
//         <Pressable
//           key={order.OrderID}
//           onPress={() => selectOrder(order.OrderID)}
//         >
//           <ThemedText style={styles.button}>{order.OrderID}</ThemedText>
//         </Pressable>
//       ))}

//       <Pressable onPress={() => router.push("/(pages)/confirmOrder")}>
//         <ThemedText style={styles.button}>Start Deliver</ThemedText>
//       </Pressable>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    color: Colors.primary,
  },
  orderCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  acceptedOrderCard: {
    backgroundColor: "#e8f5e8",
    borderColor: Colors.primary,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  shopName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  noOrdersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
    marginVertical: 20,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 60, // Add space for tab navigation
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  startDeliveryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  startDeliveryText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
