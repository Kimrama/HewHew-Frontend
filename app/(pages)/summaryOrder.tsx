import { getUserProfile } from "@/api/auth";
import { createOrder } from "@/api/order";
import { getMenubyId, Menu } from "@/api/store";
import { MenuCard } from "@/components/MenuCard";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useCart } from "@/store/cart-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SummaryOrderPage() {
  const router = useRouter();
  const { dropOffLocationId, dropOffLocationName, dropOffLocationDetail } =
    useLocalSearchParams();
  const { items, totalItems, clearCart } = useCart();
  const [cartDetails, setCartDetails] = useState<
    (Menu & { quantity: number })[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const minTime = new Date();
  minTime.setMinutes(minTime.getMinutes() + 30);

  useEffect(() => {
    const fetchCartDetails = async () => {
      const detailedItems = await Promise.all(
        items.map(async (item) => {
          const menu = await getMenubyId(item.menu_id);
          return { ...menu, quantity: item.quantity };
        })
      );
      setCartDetails(detailedItems);
      const total = detailedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    };

    fetchCartDetails();
  }, [items]);

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowTimePicker(false);
    if (selectedDate) {
      if (selectedDate < minTime) {
        Alert.alert(
          "Invalid Time",
          "Please select a time at least 30 minutes from now."
        );
        setAppointmentTime(minTime);
      } else {
        setAppointmentTime(selectedDate);
      }
    }
  };

  const handleConfirmOrder = async () => {
    const currentTotal =
      cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      deliveryFee;

    try {
      const user = await getUserProfile();
      if (parseFloat(user.wallet) < currentTotal) {
        Alert.alert(
          "Insufficient Funds",
          "You do not have enough money in your wallet to place this order."
        );
        return;
      }

      Alert.alert(
        "Confirm Order",
        `Total cost: ฿${currentTotal}. Do you want to proceed?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: async () => {
              try {
                await createOrder(
                  dropOffLocationId as string,
                  appointmentTime,
                  items
                );
                clearCart();
                router.replace("/(tabs)/home");
                Alert.alert(
                  "Order Placed",
                  "Your order has been placed successfully."
                );
              } catch (error) {
                console.error("Failed to create order:", error);
                Alert.alert(
                  "Order Failed",
                  "There was an issue placing your order."
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Failed to get user profile:", error);
      Alert.alert("Error", "Could not verify your wallet balance.");
    }
  };

  const deliveryFee = 10;
  const total = totalPrice + deliveryFee;

  return (
    <LinearGradient
      colors={Colors.bg as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={cartDetails}
          keyExtractor={(item) => item.menu_id}
          renderItem={({ item }) => <MenuCard menu={item} />}
          ListHeaderComponent={
            <>
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Items</ThemedText>
              </View>
            </>
          }
          ListFooterComponent={
            <>
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>
                  Drop-off Location
                </ThemedText>
                <View style={styles.card}>
                  <ThemedText style={styles.locationName}>
                    {dropOffLocationName}
                  </ThemedText>
                  <ThemedText style={styles.locationDetail}>
                    {dropOffLocationDetail}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>
                  Appointment Time
                </ThemedText>
                <Pressable
                  onPress={() => setShowTimePicker(true)}
                  style={styles.card}
                >
                  <ThemedText style={styles.timeText}>
                    {appointmentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </ThemedText>
                </Pressable>
              </View>
              {showTimePicker && (
                <DateTimePicker
                  value={appointmentTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={handleTimeChange}
                  minimumDate={minTime}
                />
              )}
            </>
          }
        />

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
            <ThemedText style={styles.summaryValue}>฿{totalPrice}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Delivery fee</ThemedText>
            <ThemedText style={styles.summaryValue}>฿{deliveryFee}</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryTotalLabel}>Total</ThemedText>
            <ThemedText style={styles.summaryTotalValue}>฿{total}</ThemedText>
          </View>
          <ThemedButton
            title="Confirm Order"
            onPress={handleConfirmOrder}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  locationDetail: {
    fontSize: 14,
    color: Colors.gray1,
    marginTop: 4,
  },
  timeText: {
    fontSize: 16,
    textAlign: "center",
  },
  summaryContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.gray1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 15,
  },
  summaryTotalLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
});
