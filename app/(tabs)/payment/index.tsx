import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom }]}>
            <Text style={styles.title}>Payment</Text>
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
});
