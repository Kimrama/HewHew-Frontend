import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors"

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarInactiveTintColor: Colors.white,
                tabBarActiveTintColor: Colors.white,
                tabBarStyle: {
                    backgroundColor: Colors.primary,
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                    height: 60,
                    paddingBottom: 6,
                    paddingTop: 6,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="home/index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="order/index"
                options={{
                    title: "Order",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "receipt" : "receipt-outline"}
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="payment/index"
                options={{
                    title: "Payment",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "wallet" : "wallet-outline"}
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
