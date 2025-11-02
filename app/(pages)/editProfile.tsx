import { getUser, updateProfileImage, updateUser } from "@/api/user";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const screenHeight = Dimensions.get("window").height;

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();

  const [user, setUser] = useState<any>(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const genderOptions = ["Male", "Female", "Prefer not to say"];

  // ✅ โหลดข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser();
      if (data) {
        setUser(data);
        setFname(data.fname);
        setLname(data.lname);
        setGender(data.gender);
        setProfileImage(data.profile_image_url);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // ✅ เลือกรูปภาพ (Camera หรือ Gallery)
  const pickImage = async () => {
    Alert.alert("Choose Image", "Where do you want to get the photo from?", [
      {
        text: "Camera",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage(uri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage(uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };


  // ✅ บันทึกข้อมูลผู้ใช้ + อัปโหลดรูปถ้ามี
  const handleSave = async () => {
    try {
      setLoading(true);

      // อัปโหลดรูปถ้ามีการเปลี่ยน
      if (profileImage && profileImage !== user?.profile_image_url) {
        await updateProfileImage(profileImage);
      }

      // อัปเดตข้อมูลชื่อ–นามสกุล–เพศ
      await updateUser(fname, lname, gender);

      Alert.alert("สำเร็จ", "บันทึกข้อมูลเรียบร้อยแล้ว", [
        {
          text: "ตกลง",
          onPress: () => navigation.goBack(), // เด้งกลับหน้า Profile
        },
      ]);
    } catch (err) {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตข้อมูลได้");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006D3A" />
        <Text style={{ marginTop: 8 }}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerBackground} />
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              profileImage ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          style={styles.avatar}
        />
        <Pressable style={styles.cameraButton} onPress={pickImage}>
          <MaterialIcons name="photo-camera" size={22} color="#000" />
        </Pressable>
      </View>

      <View style={styles.form}>
        <ThemedText style={styles.label}>Username</ThemedText>
        <TextInput
          value={user?.username || ""}
          editable={false}
          style={[styles.input, { backgroundColor: "#f1f1f1" }]}
        />

        <ThemedText style={styles.label}>First Name</ThemedText>
        <TextInput
          value={fname}
          onChangeText={setFname}
          style={styles.input}
        />

        <ThemedText style={styles.label}>Last Name</ThemedText>
        <TextInput
          value={lname}
          onChangeText={setLname}
          style={styles.input}
        />

        <ThemedText style={styles.label}>Gender</ThemedText>
        <View style={styles.genderContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderOption,
                gender === option && styles.genderOptionSelected,
              ]}
              onPress={() => setGender(option)}
            >
              <View
                style={[
                  styles.radioOuter,
                  gender === option && styles.radioOuterSelected,
                ]}
              >
                {gender === option && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.genderText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Pressable onPress={handleSave} style={{ marginTop: 25 }}>
          <LinearGradient
            colors={["#006D3A", "#4CAF50"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}
          >
            <ThemedText style={styles.saveText}>Save</ThemedText>
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 40,
    backgroundColor: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerBackground: {
       position: "absolute", top: 100, width: "100%", height: screenHeight, backgroundColor: Colors.white, borderTopLeftRadius: 180, borderTopRightRadius: 180 },
    
  
  avatarContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#ccc",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
  form: {
    width: "85%",
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  saveButton: {
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    bottom:-40,

  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 5,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
  },
  genderOptionSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "#E6F4EA",
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: "#4CAF50",
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  genderText: {
    fontSize: 14,
    color: "#333",
  },
});