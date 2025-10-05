import { AuthContext } from "@/store/auth-context";
import { Redirect, router } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
    const { isAuthenticated, logout, token } = useContext(AuthContext);
    const insets = useSafeAreaInsets();
    
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    const handleLogout = () => {
        logout();
        router.replace("/(auth)/login");
    };
    
    return (
        <View style={[styles.container, { paddingBottom: 60 + insets.bottom }]}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.tokenText}>Token: {token?.substring(0, 20)}...</Text>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    tokenText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
