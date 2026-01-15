import { KaushanScript_400Regular } from "@expo-google-fonts/kaushan-script";
import {
  Prompt_400Regular,
  Prompt_500Medium,
  Prompt_600SemiBold,
  Prompt_700Bold,
  useFonts,
} from "@expo-google-fonts/prompt";
import { Stack } from "expo-router";
import AuthContextProvider from "../store/auth-context";
import { CartProvider } from "../store/cart-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_600SemiBold,
    Prompt_700Bold,
    KaushanScript_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthContextProvider>
      <CartProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(pages)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </CartProvider>
    </AuthContextProvider>
  );
}
