import { ThemedText } from "@/components/ThemedText";
import { Stack } from "expo-router";

export default function PagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen
        name="menu"
        options={{
          headerTitle: () => <ThemedText type="subtitle">Menu</ThemedText>,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerTitle: () => (
            <ThemedText type="subtitle">Notifications</ThemedText>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="cart"
        options={{
          headerTitle: () => <ThemedText type="subtitle">Cart</ThemedText>,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="myOrder"
        options={{
          headerTitle: () => <ThemedText type="subtitle">My Order</ThemedText>,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="myDelivery"
        options={{
          headerTitle: () => (
            <ThemedText type="subtitle">My Delivery</ThemedText>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="orderDetail"
        options={{
          headerTitle: () => (
            <ThemedText type="subtitle">Order Details</ThemedText>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="confirmOrder"
        options={{
          headerTitle: () => (
            <ThemedText type="subtitle">Confirm Order</ThemedText>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="pingDropOffLocation"
        options={{
          headerTitle: () => (
            <ThemedText type="subtitle">Drop-off Location</ThemedText>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="imageConfirmDelivery"
        options={{
          headerTitle: () => (
            <ThemedText type="subtitle">Confirm Image</ThemedText>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="myOrderDetail"
        options={{
          headerTitle: () => (
            <ThemedText type="subtitle">My Order Detail</ThemedText>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="myDeliveryDetail"
        options={{
          headerTitle: () => (
            <ThemedText type="subtitle">My Delivery Detail</ThemedText>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="summaryOrder"
        options={{
          headerTitle: () => (
            <ThemedText type="subtitle">Order Summary</ThemedText>
          ),
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
