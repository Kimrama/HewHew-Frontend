import { getOrder, Order } from "@/api/order";
import { Colors } from "@/constants/Colors";
import { useOrderContext } from "@/store/order-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderDetail() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { acceptOrder, removeOrder, isOrderAccepted } = useOrderContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setLoading(true);
      try {
        const orders = await getOrder();
        const foundOrder = orders.find((o) => o.order_id === orderId);
        setOrder(foundOrder || null);
      } catch (error) {
        console.log("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleAcceptOrder = () => {
    if (!order) return;
    acceptOrder(order);
    Alert.alert("Success", "Order accepted successfully!");
  };

  const handleRemoveOrder = () => {
    if (!order) return;
    removeOrder(order.order_id);
    Alert.alert("Success", "Order removed from accepted list!");
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const isAccepted = isOrderAccepted(order.order_id);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: 60 + insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Order #{order.order_id}</Text>
        <Text style={styles.status}>{order.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <Text style={styles.info}>Customer ID: {order.user_order_id}</Text>
        <Text style={styles.info}>
          Order Date: {new Date(order.order_date).toLocaleDateString()}
        </Text>
        <Text style={styles.info}>
          Delivery Method: {order.delivery_method}
        </Text>
        {order.appointment_time && (
          <Text style={styles.info}>
            Appointment: {new Date(order.appointment_time).toLocaleString()}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurant Details</Text>
        <Text style={styles.info}>Shop: {order.shop_name}</Text>
        <Text style={styles.info}>Canteen: {order.canteen_name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Items</Text>
        {order.menu_quantity.map((item, index) => (
          <View key={index} style={styles.menuItem}>
            <Text style={styles.menuItemName}>Menu ID: {item.menu_id}</Text>
            <Text style={styles.menuItemQuantity}>
              Quantity: {item.quantity}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <Text style={styles.info}>Shipping Fee: ฿{order.shipping_fee}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isAccepted ? (
          <Pressable style={styles.acceptButton} onPress={handleAcceptOrder}>
            <Text style={styles.buttonText}>Accept Order</Text>
          </Pressable>
        ) : (
          <View style={styles.acceptedContainer}>
            <Text style={styles.acceptedText}>✓ Order Accepted</Text>
            <Pressable style={styles.removeButton} onPress={handleRemoveOrder}>
              <Text style={styles.buttonText}>Remove Order</Text>
            </Pressable>
          </View>
        )}
      </View>
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
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  menuItemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  acceptedContainer: {
    alignItems: "center",
  },
  acceptedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: "#ff4444",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
