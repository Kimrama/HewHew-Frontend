import { confirmOrderbyRider, finishTransaction } from "@/api/order";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ImageConfirmDelivery() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { id } = useLocalSearchParams();
  const idStr = Array.isArray(id) ? id[0] : (id ?? "");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera roll is required!"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera permissions to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Select Image",
      "Choose how you want to add an image",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Photo Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleConfirm = async () => {
    if (!selectedImage) {
      Alert.alert(
        "Please upload an image",
        "An image is required to confirm delivery."
      );
      return;
    }
    if (isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      await confirmOrderbyRider(idStr, selectedImage);
      await finishTransaction(idStr);

      Alert.alert(
        "Success!",
        "Image uploaded and delivery confirmed successfully.",
        [
          {
            text: "OK",
            onPress: () => router.push("/(pages)/myDelivery"),
          },
        ]
      );
    } catch (error) {
      console.error("Confirmation failed:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage = `An error occurred: ${
          error.response?.data?.message || error.message
        }`;
      }
      Alert.alert("Confirmation Failed", errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <ThemedText style={styles.title}>Upload Confirm Image</ThemedText>

          {/* Requirements Section */}
          <View style={styles.requirementsContainer}>
            <View style={styles.requirementItem}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="people" size={20} color={Colors.primary} />
              </View>
              <View style={styles.requirementText}>
                <ThemedText style={styles.requirementLabel}>
                  Face to face :
                </ThemedText>
                <ThemedText style={styles.requirementDescription}>
                  ถ่ายรูปใบหน้าของลูกค้าพร้อมใบลิขสิทธิ์
                </ThemedText>
              </View>
            </View>
            <View style={styles.requirementItem}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="local-shipping"
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.requirementText}>
                <ThemedText style={styles.requirementLabel}>
                  Drop-off :
                </ThemedText>
                <ThemedText style={styles.requirementDescription}>
                  ถ่ายรูปอาหารที่วางที่จุดลงของที่กำหนด
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Upload Area */}
          <View style={styles.uploadContainer}>
            <Pressable style={styles.imageContainer} onPress={showImageOptions}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.uploadedImage}
                />
              ) : (
                <Image
                  source={require("@/assets/images/upload-confirm-delivery.png")}
                  style={styles.defaultImage}
                />
              )}
              <View style={styles.imageOverlay}>
                <MaterialIcons name="edit" size={24} color={Colors.white} />
              </View>
            </Pressable>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <ThemedButton
            title={isUploading ? "Confirming..." : "Confirm"}
            onPress={handleConfirm}
            disabled={isUploading}
            style={styles.confirmButton}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.black,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  requirementsContainer: {
    marginBottom: 40,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  requirementText: {
    flex: 1,
  },
  requirementLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 4,
  },
  requirementDescription: {
    fontSize: 14,
    color: Colors.gray1,
    lineHeight: 20,
  },
  uploadContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  imageContainer: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#D9D9D9",
    borderWidth: 1,
    borderColor: "#6E6E6E",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  defaultImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  confirmButton: {
    width: "100%",
  },
});
