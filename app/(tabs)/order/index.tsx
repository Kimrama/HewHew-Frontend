import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { getOrder, Order } from "@/api/order";
import { OrderProvider, useOrders, OrderType } from "@/components/OrderContext";

export default function Index() {
  const insets = useSafeAreaInsets();
  const [mappedOrders, setMappedOrders] = useState<OrderType[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrder();
        console.log("API response:", response);

        const orders: OrderType[] = response.map(o => ({
          OrderID: o.OrderID,
        }));

        setMappedOrders(orders);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!mappedOrders) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  return (
    <OrderProvider initialOrders={mappedOrders}>
      <OrderList insets={insets} />
    </OrderProvider>
  );
}

function OrderList({ insets }: { insets: { bottom: number }}) {
  const router = useRouter();
  const { orders, selectOrder } = useOrders();

  return (
    <View style={[styles.container, { paddingBottom: 60 + insets.bottom }]}>
      <Text style={styles.title}>Order</Text>

      {orders.map(order => (
        <Pressable
          key={order.OrderID}
          onPress={() => selectOrder(order.OrderID)}
        >
          <ThemedText style={styles.button}>{order.OrderID}</ThemedText>
        </Pressable>
      ))}

      <Pressable onPress={() => router.push("/(pages)/confirmOrder")}>
        <ThemedText style={styles.button}>Start Deliver</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginTop: 10
  }
});
