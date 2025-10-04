import { Stack } from "expo-router";

export default function PagesLayout() {
    return (
        <Stack>
            <Stack.Screen name="search" options={{ headerShown: false }} />
            <Stack.Screen name="menu" options={{ title: "Menu", headerTitleAlign: "center",}} />
        </Stack>
    );
}