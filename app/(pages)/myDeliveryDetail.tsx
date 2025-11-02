import { DropOff, getOrderbyId, Order, User } from "@/api/order";
import { OrderBlock } from "@/components/OrderBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useOrderContext } from "@/store/order-context";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function deliveryDetail() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<(Order & { User?: User; menus: { name: string; detail: string; price: number; quantity: number }[]; totalQuantity: number; dropOffLocation?: DropOff;})>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setLoading(true);
      try {
        const orderData = await getOrderbyId(orderId);
        setOrder(orderData);
        console.log(order?.confirmation_image_url);
      } catch (error) {
        console.log("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);


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

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 31, paddingTop: 10 }}>
        {/* header */}
        <View
          style={[
            styles.row,
            { justifyContent: "space-between", paddingVertical: 10 },
          ]}
        >
          <View style={styles.canteen}>
            <ThemedText>{order.canteen_name}</ThemedText>
          </View>

          <View style={styles.row}>
            <View style={styles.amount}>
              <ThemedText>{order.totalQuantity}</ThemedText>
            </View>
            <ThemedText style={{ paddingLeft: 10 }}>รายการ</ThemedText>
          </View>
        </View>

        {/* order */}
        <OrderBlock
          store={order.shop_name}
          amount={order.totalQuantity}
          canteen={order.canteen_name}
          menus={order.menus}
          orderPrice={order.amount}
          name={order.User?.username ?? 'Unknown'}
          address={order.dropOffLocation?.name ?? ''}
          addressDetail={order.dropOffLocation?.detail ?? ''}
          deliveryMethod={order.delivery_method}
          appointmentTime={order.appointment_time}
          riderEarn={order.shipping_fee}
          type="myDeliveryDetail"
          confirmImage={order.confirmation_image_url}
        />

      </SafeAreaView>
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
  amount: {
    height: 25,
    width: 25,
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
