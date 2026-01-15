import { getUserbyId, User } from "@/api/order";
import { postReview } from "@/api/review";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageStyle,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewPage() {
  const router = useRouter();
  const { orderId, targetUserId } = useLocalSearchParams<{
    orderId: string;
    targetUserId: string;
  }>();

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (targetUserId) {
      getUserbyId(targetUserId)
        .then(setTargetUser)
        .catch((err) => {
          console.error("Failed to fetch target user:", err);
          Alert.alert("Error", "Could not load user details.");
        });
    }
  }, [targetUserId]);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Please provide a rating");
      return;
    }
    if (!orderId || !targetUserId) {
      Alert.alert("Error", "Missing order or user information.");
      return;
    }

    setIsSubmitting(true);
    try {
      await postReview(targetUserId, orderId, rating, comment);
      Alert.alert("Success", "Your review has been submitted.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Failed to submit review:", error);
      Alert.alert("Error", "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.userTag}>
            <ThemedText style={styles.userName}>
              Reveiw: {targetUser?.fname} {targetUser?.lname}
            </ThemedText>
          </View>

          <ThemedText style={styles.ratingLabel}>Rate the user:</ThemedText>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => handleRating(star)}>
                <MaterialIcons
                  name={rating >= star ? "star" : "star-border"}
                  size={40}
                  color={Colors.yellow}
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.commentInput}
            placeholder="Write your review..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
        </View>

        <View style={styles.footer}>
          <Pressable>
            <View
              style={{
                backgroundColor: Colors.red,
                padding: 8,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <ThemedText
                style={{ color: "white", fontSize: 16 }}
                onPress={() => router.back()}
              >
                Cancel
              </ThemedText>
            </View>
          </Pressable>
          <Pressable>
            <View
              style={{
                backgroundColor: Colors.green,
                padding: 8,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <ThemedText
                style={{ color: "white", fontSize: 16 }}
                onPress={handleSubmit}
              >
                Submit
              </ThemedText>
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  content: ViewStyle;
  userTag: ViewStyle;
  userImage: ImageStyle;
  userName: TextStyle;
  ratingLabel: TextStyle;
  starsContainer: ViewStyle;
  commentInput: TextStyle;
  footer: ViewStyle;
  button: ViewStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.green,
    padding: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  userName: {
    color: Colors.white,
    fontWeight: "bold",
  },
  ratingLabel: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  commentInput: {
    height: 150,
    borderWidth: 1,
    borderColor: Colors.gray1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    backgroundColor: Colors.white,
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    width: "20%",
  },
});
