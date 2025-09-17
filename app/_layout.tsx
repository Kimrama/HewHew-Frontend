import { Stack } from "expo-router";
import { useFonts, Prompt_400Regular, Prompt_500Medium, Prompt_700Bold } from '@expo-google-fonts/prompt';

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Prompt_400Regular,
        Prompt_500Medium,
        Prompt_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
    );
}