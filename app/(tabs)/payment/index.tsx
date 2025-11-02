import { useRouter } from "expo-router"; // ✅ ใช้สำหรับ navigation
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter(); // ✅ ใช้ router เพื่อเปลี่ยนหน้า

  return (
    <View style={[styles.container, { paddingBottom: 60 + insets.bottom }]}>
      <Text style={styles.title}>Payment</Text>

      {/* ปุ่มไปหน้า chooseTime */}
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(pages)/selectPickupTime")} // ✅ กดแล้วไปหน้า chooseTime
      >
        <Text style={styles.buttonText}>เลือกเวลา</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(pages)/notifications")} // ✅ กดแล้วไปหน้า chooseTime
      >
        <Text style={styles.buttonText}>noti</Text>
      </Pressable>
      
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(pages)/searchOrder")} // ✅ กดแล้วไปหน้า chooseTime
      >
        <Text style={styles.buttonText}>sea</Text>
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
