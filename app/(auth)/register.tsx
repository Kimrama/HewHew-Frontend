import Ionicons from "@expo/vector-icons/build/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { UserSignUp } from "../../types/user";
export default function Register() {
  const [userInput, setUserInput] = useState<UserSignUp>({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ScrollView style={styles.container}>
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
            <Image
              source={require("@/assets/images/upload-image.png")}
              style={{ width: 130, height: 130, position: "relative", left: 8 }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={userInput.username}
            onChangeText={(text) =>
              setUserInput({ ...userInput, username: text })
            }
          />
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={userInput.firstName}
            onChangeText={(text) =>
              setUserInput({ ...userInput, firstName: text })
            }
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={userInput.lastName}
            onChangeText={(text) =>
              setUserInput({ ...userInput, lastName: text })
            }
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={userInput.password}
            onChangeText={(text) =>
              setUserInput({ ...userInput, password: text })
            }
            secureTextEntry={true}
          />
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={userInput.confirmPassword}
            onChangeText={(text) =>
              setUserInput({ ...userInput, confirmPassword: text })
            }
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            // onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#0A6847", "#7ABA78"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.line} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ textAlign: "center", alignItems: "center" }}>
              Don't have any account?{" "}
            </Text>
            <Pressable
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderColor: "#0A6847",
              }}
              onPress={() => router.replace("/(auth)/register")}
            >
              <Text style={{ color: "#0A6847" }}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
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
  },

  inputContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ABABAB",
    padding: 15,
    marginBottom: 15,
    borderRadius: 18,
    fontSize: 16,
    backgroundColor: "white",
  },
  buttonContainer: {
    // position: "absolute",
    // bottom: 100,
    // left: 0,
    // right: 0,
    // zIndex: 2,
    // paddingHorizontal: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginBottom: 20,
  },
  line: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
});
