import AuthContextProvider from "@/store/auth-context";
import { KaushanScript_400Regular } from '@expo-google-fonts/kaushan-script';
import { Prompt_400Regular, Prompt_500Medium, Prompt_700Bold, useFonts } from '@expo-google-fonts/prompt';
import { Stack } from "expo-router";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Prompt_400Regular,
        Prompt_500Medium,
        Prompt_700Bold,
        KaushanScript_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AuthContextProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                 <Stack.Screen name="(pages)" options={{ headerShown: false }} />
            </Stack>
        </AuthContextProvider>
    );
}