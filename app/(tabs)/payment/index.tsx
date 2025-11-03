import { getUser } from "@/api/order";
import { getWalletBalance, topUpWallet } from "@/api/wallet"; // เรียกใช้ API ที่มีอยู่
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/store/auth-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Image,Pressable, StyleSheet,ScrollView, Text, TextInput, View } from "react-native";


const TopUpScreen = () => {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const [amount, setAmount] = useState<string>(""); // ใช้ string เพราะต้องรับค่าจาก TextInput
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // สำหรับเก็บข้อมูลผู้ใช้
  const [walletBalance, setWalletBalance] = useState<number>(0); // สำหรับเก็บยอดเงินในกระเป๋า
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("K PLUS"); // สำหรับเก็บช่องทางการชำระเงินที่เลือก

  // ดึงข้อมูลผู้ใช้และยอดเงิน
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const balance = await getWalletBalance(); // ดึงยอดเงินจาก API
        setWalletBalance(balance);
        // ดึงข้อมูลผู้ใช้ (ถ้ามี API สำหรับดึงข้อมูลผู้ใช้โดยตรงสามารถใช้ได้)
        const userData = await getUser(); // สมมติว่า getUser() ดึงข้อมูลผู้ใช้
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []); // ใช้ useEffect สำหรับดึงข้อมูลผู้ใช้และยอดเงินเมื่อหน้าโหลด

  const handleTopUp = async () => {
    const parsedAmount = parseFloat(amount); // แปลงค่าจำนวนเงินเป็นตัวเลขทศนิยม

    if (!parsedAmount || parsedAmount < 10) {
      Alert.alert("Top Up Failed", "Please enter a minimum amount of 10 Baht");
      return;
    }

    try {
      setLoading(true);
      const response = await topUpWallet(parsedAmount); // เรียก API เติมเงิน
      Alert.alert("สำเร็จ", response); // แสดงข้อความจาก API
      // เรียก getWalletBalance เพื่อดึงข้อมูลยอดเงินใหม่หลังจากเติมเงินเสร็จ
      const newBalance = await getWalletBalance();
      setWalletBalance(newBalance); // อัปเดตยอดเงินใหม่
      router.back(); // กลับไปหน้าโปรไฟล์
    } catch (err) {
      Alert.alert("Error", "Unable to complete the transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={Colors.bg} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}

        {/* แสดงชื่อผู้ใช้และยอดเงิน */}
        <View style={styles.userInfo}>
          <ThemedText style={styles.username}>{user?.username}</ThemedText>
          <ThemedText style={styles.walletInfo}>
            ฿ {walletBalance} {/* แสดงยอดเงินล่าสุด */}
          </ThemedText>
        </View>

        {/* ช่องทางชำระเงิน */}
<View style={styles.paymentMethod}>
  <ThemedText style={styles.paymentLabel}>ช่องทางการเติมเงิน</ThemedText>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
  >
    {[
      { name: "K PLUS", image: require("@/assets/images/kplus.png") },
      { name: "TrueMoney", image: require("@/assets/images/truemoney.png") },
      { name: "Rabbit LINE Pay", image: require("@/assets/images/rabbit.jpg") },
      { name: "AirPay", image: require("@/assets/images/airpay.jpg") },
      { name: "PromptPay", image: require("@/assets/images/promptPay.jpg") },
    ].map((method) => (
      <Pressable
        key={method.name}
        style={[
          styles.paymentCard,
          selectedPaymentMethod === method.name && styles.paymentCardActive,
        ]}
        onPress={() => setSelectedPaymentMethod(method.name)}
      >
        <Image
          source={method.image}
          style={[
            styles.paymentImage,
            selectedPaymentMethod === method.name && styles.paymentImageActive,
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.paymentCardText,
            selectedPaymentMethod === method.name && styles.paymentCardTextActive,
          ]}
        >
          {method.name}
        </Text>
      </Pressable>
    ))}
  </ScrollView>
</View>



        {/* การกรอกจำนวนเงิน */}
        <View style={styles.box}>
          <ThemedText style={styles.label}>จำนวนเงิน (บาท)</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="ระบุจำนวนเงิน"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)} // เก็บค่าจำนวนเงินที่กรอก
          />

          {/* ปุ่มลัด */}
          <View style={styles.quickRow}>
            {[200, 500, 1000, 2000].map((value) => (
              <Pressable
                key={value}
                style={[
                  styles.quickButton,
                  parseFloat(amount) === value && styles.quickButtonActive,
                ]}
                onPress={() => setAmount(value.toString())} // เปลี่ยนเป็น string เพื่อใช้งานกับ TextInput
              >
                <Text
                  style={[
                    styles.quickText,
                    parseFloat(amount) === value && styles.quickTextActive,
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* ปุ่มเติมเงิน */}
          <Pressable
            style={[styles.submitButton, loading && { opacity: 0.6 }]}
            onPress={handleTopUp}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? "Processing..." : `Top up ${amount || 0} THB`}
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

export default TopUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  userInfo: {
    width: "85%",
    marginBottom: 20,
    paddingHorizontal: 16,
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  walletInfo: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  paymentMethod: {
    width: "85%",
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },
  paymentLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },

  
paymentCard: {
  width: 130,
  height: 130,
  borderRadius: 16,
  backgroundColor: "#fff",
  marginRight: 15,
  justifyContent: "center",
  alignItems: "center",
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
paymentCardActive: {
  backgroundColor: Colors.primary,
  elevation: 6,
},
paymentCardText: {
  marginTop: 10,
  fontSize: 14,
  color: "#333",
  textAlign: "center",
},
paymentCardTextActive: {
  color: "#fff",
},
paymentImage: {
  width: 70,
  height: 70,
  borderRadius: 12,
},
paymentImageActive: {
 
},

  selectedPaymentOption: {
    backgroundColor: Colors.primary,
  },
  paymentText: {
    fontSize: 16,
    marginLeft: 10,
  },
  box: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  quickText: { color: "#000", }, quickTextActive: { color: "#fff", },
  quickButton: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  quickButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
  },
});
