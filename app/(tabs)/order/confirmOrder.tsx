import { Colors } from "@/constants/Colors";
import { useOrderContext } from "@/store/order-context";
import { useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConfirmOrder() {
  const { acceptedOrders, removeOrder } = useOrderContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const calculateTotalPrice = () => {
    return acceptedOrders.reduce(
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
            if (acceptedOrders.length === 1) {
              // If this is the last order, go back to order list
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleConfirmDelivery = () => {
    if (acceptedOrders.length === 0) {
      Alert.alert("No Orders", "You haven't accepted any orders yet.");
      return;
    }

    Alert.alert(
      "Confirm Delivery",
      `Are you sure you want to start delivery for ${acceptedOrders.length} order(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            // Navigate to delivery page
            router.push("/(pages)/myDelivery");
            Alert.alert("Success", "Delivery started successfully!");
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: 60 + insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Orders</Text>
        <Text style={styles.subtitle}>
          Review your accepted orders before starting delivery
        </Text>
      </View>

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
          <View style={styles.ordersSection}>
            <Text style={styles.sectionTitle}>
              Accepted Orders ({acceptedOrders.length})
            </Text>
            {acceptedOrders.map((order, index) => (
              <View key={order.order_id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>Order #{index + 1}</Text>
                  <View style={styles.orderHeaderRight}>
                    <Text style={styles.orderId}>ID: {order.order_id}</Text>
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => handleRemoveOrder(order.order_id)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <Text style={styles.orderInfo}>
                    Customer: {order.user_order_id}
                  </Text>
                  <Text style={styles.orderInfo}>Shop: {order.shop_name}</Text>
                  <Text style={styles.orderInfo}>
                    Canteen: {order.canteen_name}
                  </Text>
                  <Text style={styles.orderInfo}>
                    Items: {order.menu_quantity.length}
                  </Text>
                  <Text style={styles.orderInfo}>
                    Delivery Method: {order.delivery_method}
                  </Text>
                  {order.appointment_time && (
                    <Text style={styles.orderInfo}>
                      Appointment:{" "}
                      {new Date(order.appointment_time).toLocaleString()}
                    </Text>
                  )}
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Shipping Fee:</Text>
                  <Text style={styles.price}>฿{order.shipping_fee}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Delivery Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Orders:</Text>
              <Text style={styles.summaryValue}>{acceptedOrders.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Earnings:</Text>
              <Text style={styles.summaryValue}>฿{calculateTotalPrice()}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.confirmButton}
              onPress={handleConfirmDelivery}
            >
              <Text style={styles.confirmButtonText}>
                ยืนยันการจัดส่ง ({acceptedOrders.length} รายการ)
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
});
