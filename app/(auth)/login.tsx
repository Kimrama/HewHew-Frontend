import { AuthContext } from "@/store/auth-context";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace this with your actual API call
      // For now, simulating a login with a fake token
      const fakeToken = "fake-jwt-token-" + Date.now();
      authenticate(fakeToken);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>HewHew</Text>
      <Pressable
        onPress={() => router.replace("/home")}
        style={{ position: "absolute", top: 40, left: 20 }}
      >
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </Pressable>
      <View style={styles.inputContainer}>
        <View style={{ marginBottom: 30 }}>

        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          />
          </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#0A6847", "#7ABA78"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={styles.rotateBackground}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  inputContainer: {
    width: "96%",
    maxWidth: 400,
    marginTop: 60,
    zIndex: 2,
    justifyContent: "space-between",
  },
  brand: {
    position: "absolute",
    top: 120,
    fontSize: 45,
    fontFamily: "KaushanScript_400Regular",
    color: "#0A6847",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "left",
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
  button: {
    borderRadius: 25,
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  rotateBackground: {
    position: "absolute",
    bottom: -160,
    left: -180,
    zIndex: 1,
    borderRadius: 60,
    backgroundColor: "#FFE8DB",
    width: 750,
    height: 750,
    transform: [{ rotate: "24deg" }],
  },
});
