import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from "@/components/ThemedText";

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    
    return (
        <Tabs
            screenOptions={{
                tabBarInactiveTintColor: Colors.white,
                tabBarActiveTintColor: Colors.white,
                tabBarStyle: {
                    backgroundColor: Colors.primary,
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 6,
                    paddingTop: 6,
                    position: 'absolute',
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="home/index"
                options={{
                    tabBarLabel: ({ focused, color }) => (<ThemedText style={{color: color}}>Home</ThemedText>),
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
                    tabBarLabel: ({ focused, color }) => (<ThemedText style={{color: color}}>Order</ThemedText>),
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
                    tabBarLabel: ({ focused, color }) => (<ThemedText style={{color: color}}>Payment</ThemedText>),
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
                    tabBarLabel: ({ focused, color }) => (<ThemedText style={{color: color}}>Home</ThemedText>),
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
