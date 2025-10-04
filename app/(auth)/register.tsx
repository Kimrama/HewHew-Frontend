import AntDesign from "@expo/vector-icons/build/AntDesign";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Register() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          style={{ position: "absolute", top: 40, left: 20 }}
        >
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Sign Up</Text>
      </View>
      <LinearGradient
        colors={["#FFE8DB", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.pictureContainer}>
            <View style={styles.picture}>

            <AntDesign name="upload" size={100} color="black" />
            </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    position: "relative",
    bottom: -10,
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,

    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pictureContainer: {
    alignItems: "center",
    justifyContent: "center",
    
  }, 
  picture: {
    width: 235,
    height: 235,
    borderRadius: "100%",
    backgroundColor: "#D9D9D9",
    borderWidth: 1,
    borderColor: "#6E6E6E",
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
  }
});
