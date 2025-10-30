import { OrderBlock } from "@/components/OrderBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { OrderType, sampleOrder } from "@/sampleData/sampleOrder";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const width = 412;
const default_image = require("@/assets/images/default-featured-image.jpg");
const order: OrderType = sampleOrder[0];

export default function OrderDetail() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 31, paddingTop: 20 }}>
        {/* header */}
        <View
          style={[
            styles.row,
            { justifyContent: "space-between", paddingBottom: 10 },
          ]}
        >
          <View style={styles.canteen}>
            <ThemedText>{order.canteen}</ThemedText>
          </View>

          <View style={styles.row}>
            <View style={styles.amount}>
              <ThemedText>{order.amount}</ThemedText>
            </View>
            <ThemedText style={{ paddingLeft: 10 }}>รายการ</ThemedText>
          </View>
        </View>

        {/* order */}
        <OrderBlock
          store={order.store}
          amount={order.amount}
          canteen={order.canteen}
          menus={order.menus}
          orderPrice={order.orderPrice}
          name={order.name}
          address={order.address}
          deliveryMethod={order.deliveryMethod}
          appointmentTime={order.appointmentTime}
          riderEarn={order.riderEarn}
          type="orderDetail"
        />

        {/* button */}
        {/* check: order <= rider's ability*/}
        <View style={styles.button}>
          <ThemedButton
            title="เพิ่มรายการคำสั่งซื้อ"
            variant="primary"
            onPress={() => router.push("/(tabs)/order")}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
