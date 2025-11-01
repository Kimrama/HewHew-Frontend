import { StatusBlock } from "@/components/StatusBlock";
import { Colors } from "@/constants/Colors";
import { sampleStatus } from "@/sampleData/sampleStatus";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from 'react';
import { getMyOrder, Order, User } from "@/api/order";

export default function myOrder() {
  const [myOrder, setMyOrder] = useState<(Order & { User?: User;})[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getMyOrder();
          console.log("OOOOOrder",response)
          setMyOrder(response);
        } catch (err) {
          console.error(err);
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
          data={myOrder}
          keyExtractor={(item, index) => `${item.order_id}-${index}`}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          renderItem={({ item }) => {
            const totalQuantity = item.menu_quantity?.reduce(
              (sum, menu) => sum + (menu.quantity ?? 0),
              0
            ) ?? 0;

            return (
              <StatusBlock
                name={item.User?.username ?? 'Unknown'}
                canteen={item.canteen_name}
                store={item.shop_name}
                appointmentTime={item.appointment_time}
                deliveryMethod={item.delivery_method}
                amount={totalQuantity}
                shipping_fee={item.shipping_fee}
                price={item.amount}
                status={item.status}
                type='customer'
              />
            );
          }}
        />
      </View>
    </LinearGradient>
  );
}
