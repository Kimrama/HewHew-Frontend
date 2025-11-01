import { StatusBlock } from "@/components/StatusBlock";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Pressable, View } from "react-native";
import { useEffect, useState } from 'react';
import { getMyOrder, Order, User } from "@/api/order";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";

export default function myOrder() {
  const [myOrder, setMyOrder] = useState<(Order & { User?: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyOrder();
        setMyOrder(response);
        console.log(response)
      } catch (err) {
        console.error(err);
        setMyOrder([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, alignItems: 'center' }}>
        <FlatList
          data={myOrder ?? [].slice().reverse()}
          keyExtractor={(item, index) => `${item.order_id}-${index}`}
          contentContainerStyle={{ paddingVertical: 10, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          ListEmptyComponent={
            !loading ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 }}>
                <ThemedText style={{ fontSize: 16,}}>
                  ไม่มีคำสั่งซื้อในขณะนี้
                </ThemedText>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const totalQuantity =
              item.menu_quantity?.reduce(
                (sum, menu) => sum + (menu.quantity ?? 0),
                0
              ) ?? 0;

            return (
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/(pages)/myOrderDetail",
                    params: { orderId: item.order_id },
                  });
                }}
              >
                <StatusBlock
                  name={item.User?.username ?? "Unknown"}
                  canteen={item.canteen_name}
                  store={item.shop_name}
                  appointmentTime={item.appointment_time}
                  deliveryMethod={item.delivery_method}
                  amount={totalQuantity}
                  shipping_fee={item.shipping_fee}
                  price={item.amount}
                  status={item.status}
                  type="customer"
                />
              </Pressable>
            );
          }}
        />
      </View>
    </LinearGradient>
  );
}
