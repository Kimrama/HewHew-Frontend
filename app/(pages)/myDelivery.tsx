import { SafeAreaView, StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { StatusBlock } from "@/components/StatusBlock";
import { useEffect, useState } from 'react';
import { getMyDelivery, Order, User } from '@/api/order';
import { ThemedText } from '@/components/ThemedText';

export default function MyDelivery() {
  const [myDelivery, setMyDelivery] = useState<(Order & { User?: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyDelivery();
        setMyDelivery(response);
      } catch (err) {
        console.error(err);
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
          data={[...myDelivery].reverse() ?? []}
          keyExtractor={(item, index) => `${item.order_id}-${index}`}
          contentContainerStyle={{ paddingVertical: 10, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}

          ListEmptyComponent={
            !loading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 100 }}>
                <ThemedText style={{ fontSize: 16,}}>
                  ยังไม่มีรายการจัดส่งในขณะนี้
                </ThemedText>
              </View>
            ): null
          }

          renderItem={({ item }) => {
            const totalQuantity =
              item.menu_quantity?.reduce(
                (sum, menu) => sum + (menu.quantity ?? 0),
                0
              ) ?? 0;

            return (
              <StatusBlock
                id={item.order_id}
                name={item.User?.username ?? 'Unknown'}
                canteen={item.canteen_name}
                store={item.shop_name}
                appointmentTime={item.appointment_time}
                deliveryMethod={item.delivery_method}
                amount={totalQuantity}
                shipping_fee={item.shipping_fee}
                price={item.amount}
                status={item.status}
                type='rider'
              />
            );
          }}
        />
      </View>
    </LinearGradient>
  );
}
