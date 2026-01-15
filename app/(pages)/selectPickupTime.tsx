import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChooseTime() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const times = [
    "08.00 น.", "08.30 น.", "09.00 น.",
    "09.30 น.", "10.00 น.", "10.30 น.",
    "11.00 น.", "11.30 น.", "12.00 น.",
    "12.30 น.", "13.00 น.", "13.30 น.",
    "14.00 น.", "14.30 น.", "15.00 น.",
    "15.30 น.", "16.00 น.", "16.30 น.",
    "17.00 น.", "17.30 น.", "18.00 น.",
  ];

  // ✅ ฟังก์ชันตรวจว่าเวลานั้นผ่านมาแล้วหรือยัง
  const isPastTime = (timeString: string) => {
    const [hourStr, minuteStr] = timeString.replace(" น.", "").split(".");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const now = new Date();
    const target = new Date();
    target.setHours(hour, minute, 0, 0);

    return target < now; // true = ผ่านไปแล้ว
  };

  const handleConfirm = () => {
    if (selectedTime) {
      router.push({
        pathname: "/(tabs)/payment",
        params: { pickupTime: selectedTime },
      });
    }
  };

  return (
    <LinearGradient
      colors={["#FFEBD8", "#FFF8F0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>เลือกช่วงเวลารับอาหาร</Text>
        <Text style={styles.subHeader}>จัดส่งภายใน 30 นาทีจากเวลาที่เลือก</Text>

        <View style={styles.clockWrapper}>
          <Image
            source={require("@/assets/images/clock.png")}
            style={styles.clockImage}
          />
        </View>

        <View style={styles.greenSection}>
          <LinearGradient
            colors={[Colors.green, "#0E3821"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.greenBackground}
          >
            <Text style={styles.dateText}>12 กันยายน 2568</Text>

            <FlatList
              data={times}
              numColumns={3}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const past = isPastTime(item);
                const selected = selectedTime === item;

                return (
                  <Pressable
                    disabled={past} // ✅ ถ้าเป็นเวลาที่ผ่านมาแล้วให้กดไม่ได้
                    onPress={() => setSelectedTime(item)}
                    style={[
                      styles.timeButton,
                      selected && styles.timeButtonSelected,
                      past && styles.timeButtonDisabled, // ✅ เพิ่มสไตล์สีจาง
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        selected && styles.timeTextSelected,
                        past && styles.timeTextDisabled, // ✅ สีอักษรจาง
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
              contentContainerStyle={styles.timeContainer}
              showsVerticalScrollIndicator={false}
            />
          </LinearGradient>
        </View>

        <LinearGradient
          colors={["#FFD56F", "#FFE6B3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.confirmButton, !selectedTime && { opacity: 0.5 }]}
        >
          <Pressable
            disabled={!selectedTime}
            onPress={handleConfirm}
            style={{ alignItems: "center" }}
          >
            <Text style={styles.confirmText}>ยืนยัน</Text>
          </Pressable>
        </LinearGradient>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: { fontSize: 22, fontWeight: "bold", color: "#000", marginBottom: 4 },
  subHeader: { color: "#666", marginBottom: 10 },
  clockWrapper: { position: "absolute", top: 90, alignSelf: "center", zIndex: 5 },
  clockImage: { width: 140, height: 140, resizeMode: "contain" },
  greenSection: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    overflow: "hidden",
    marginTop: 80,
  },
  greenBackground: { flex: 1, width: "100%", alignItems: "center", paddingTop: 70 },
  dateText: { fontSize: 16, fontWeight: "600", color: "#fff", marginBottom: 20 },
  timeContainer: { justifyContent: "center", alignItems: "center", paddingHorizontal: 10, paddingBottom: 100 },
  timeButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 8,
    elevation: 2,
    minWidth: 90,
    alignItems: "center",
  },
  timeButtonSelected: { backgroundColor: "#FFD56F" },
  timeButtonDisabled: { backgroundColor: "#ccc" }, // ✅ ปุ่มสีเทาเมื่อ disable
  timeText: { color: "#000", fontWeight: "500" },
  timeTextSelected: { color: "#000", fontWeight: "bold" },
  timeTextDisabled: { color: "#777" }, // ✅ ตัวหนังสือจางลง
  confirmButton: {
    position: "absolute",
    bottom: 80,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 100,
    elevation: 3,
  },
  confirmText: { fontSize: 16, fontWeight: "bold", color: "#0A6847" },
});
