import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function Index() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom }]}>
            <Text style={styles.title}>Order</Text>

            <Pressable onPress={() => {router.push("/(pages)/orderDetail");}}>
                <ThemedText style={styles.button}>Order 1</ThemedText>
            </Pressable>

            <Pressable onPress={() => {router.push("/(pages)/confirmOrder");}}>
                <ThemedText style={styles.button}>start deliver</ThemedText>
            </Pressable>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    button: {
        // color: Colors.white,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 6,
        marginTop: 10
    }
});
