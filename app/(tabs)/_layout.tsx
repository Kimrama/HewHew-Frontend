import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#007AFF",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: "#d9d9d9",
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
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="home-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="order/index"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="receipt-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="payment/index"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="wallet-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="person-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
