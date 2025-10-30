import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const width = 412;
const default_image = require("@/assets/images/default-featured-image.jpg");

const styles = StyleSheet.create({});

export default function notifications() {
  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}></SafeAreaView>
    </LinearGradient>
  );
}
