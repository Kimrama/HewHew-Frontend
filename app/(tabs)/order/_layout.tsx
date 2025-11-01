import { ThemedText } from "@/components/ThemedText";
import { Stack } from "expo-router";

export default function PagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="orderDetail"
        options={{
          headerTitle: () => <ThemedText type="subtitle">Order Detail</ThemedText>,
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="confirmOrder"
        options={{
          headerTitle: () => <ThemedText type="subtitle">Confirm Order</ThemedText>,
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}