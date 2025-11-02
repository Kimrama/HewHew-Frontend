import { getUser } from '@/api/order'; // Import your API functions here
import { getAverageRating } from '@/api/review';
import { RatingStars } from '@/components/RatingStars';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthContext } from "@/store/auth-context";
import { useContext } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const screenHeight = Dimensions.get('window').height;

const ProfileScreen = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);  // For storing user profile data
  const [walletBalance, setWalletBalance] = useState<number>(0);  // For storing wallet balance
  const [averageRating, setAverageRating] = useState<number | null>(null);  // State to store average rating
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, logout, token } = useContext(AuthContext);
    const insets = useSafeAreaInsets();
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login.");
        return <Redirect href="/(auth)/login" />;
    }
  // Fetch user profile and wallet data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getUser();  // Fetch user data
        setUserProfile(profileData);

        // Fetch average rating data
        const ratingData = await getAverageRating();
        console.log('Average Rating Data 22:', ratingData);
        setAverageRating(ratingData);
       

        // Example wallet balance data (you can replace this with your API call)
        setWalletBalance(45.00);  // Replace this with the actual wallet fetching logic
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
        console.error(err);
      }
    };

    if (isAuthenticated && token) {
      fetchData();
    }
  }, [isAuthenticated, token]);
    
    const handleLogOut = () => {   
        logout();
        router.replace("/(auth)/login");}

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.curvedHeader} />
        <Pressable onPress={handleLogOut} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: userProfile?.profile_image_url || 'https://i.pravatar.cc/100' }}
          style={styles.avatarCircle}
        />
      </View>

      {/* Username */}
      <ThemedText style={styles.username}>{userProfile?.username || 'username'}</ThemedText>
      <ThemedText style={styles.fullName}>{userProfile?.fname} {userProfile?.lname}</ThemedText>

      {/* Edit Profile */}
      <Pressable style={styles.editButton}>
        <ThemedText style={styles.editThemedText}>Edit Profile</ThemedText>
      </Pressable>

      {/* Rating */}
      <Pressable onPress={() => router.push('/rating')} style={{ alignItems: 'center', marginBottom: 20 }}>
        <ThemedText style={styles.ratingThemedText}>
          {averageRating ? averageRating.toFixed(1) : '0.0'}<ThemedText style={{ color: '#ccc' }}>/5</ThemedText>
        </ThemedText>
        <RatingStars rating={averageRating || 0} size={24} />
      </Pressable>

      {/* Wallet */}
      <View style={styles.walletBox}>
        <View style={styles.walletRow}>
          <MaterialIcons name="account-balance-wallet" size={26} color={Colors.primary} />
          <ThemedText style={styles.walletAmount}>฿ {walletBalance}</ThemedText>
        </View>
        <Pressable style={styles.walletButton}>
          <ThemedText style={styles.walletButtonThemedText}>Add Wallet</ThemedText>
        </Pressable>
      </View>

      {/* Orders and Delivery Cards */}
      <View style={{ width: '80%' }}>
        <Pressable
          style={styles.card}
          onPress={() => router.push('/(pages)/myOrder')}
        >
          <View style={styles.row}>
            <MaterialIcons name="list-alt" size={26} color={Colors.primary} />
            <View style={{ marginLeft: 10 }}>
              <ThemedText type="subtitle">ออเดอร์ของฉัน</ThemedText>
              <Text style={styles.desc}>ดูประวัติและรายละเอียดคำสั่งซื้อ</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={26} color={Colors.primary} />
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/(pages)/myDelivery')}
        >
          <View style={styles.row}>
            <MaterialIcons name="delivery-dining" size={26} color={Colors.primary} />
            <View style={{ marginLeft: 10 }}>
              <ThemedText type="subtitle">การจัดส่งของฉัน</ThemedText>
              <Text style={styles.desc}>ยืนยันและติดตามสถานะการจัดส่ง</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={26} color={Colors.primary} />
        </Pressable>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
  },
  headerWrapper: {
    width: '100%',
    height: 160,
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: 0,
  },
  curvedHeader: {
    position: 'absolute',
    top: 150,
    width: '100%',
    height: screenHeight,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 50,
    elevation: 3,
  },
  avatarContainer: {
    marginTop: -70,
    marginBottom: 15,
    zIndex: 2,
  },
  avatarCircle: {
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: '#aaa',
  },
  username: { fontWeight: 'bold', fontSize: 24 },
  fullName: { color: 'gray', fontSize: 16, marginBottom: 16 },
  editButton: {
    backgroundColor: '#A4DA99',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  editThemedText: { color: '#fff', fontWeight: 'bold' },
  ratingThemedText: { fontSize: 16, marginBottom: 8 },
  walletBox: {
    backgroundColor: '#FDE1D5',
    width: '80%',
    padding: 16,
    alignItems: 'flex-end',
    alignSelf: 'center',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  walletAmount: { fontSize: 18, marginBottom: 10, textAlign: 'right' },
  walletButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  walletButtonThemedText: { color: '#000' },

  // Card style
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    // elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  desc: { color: '#555', fontSize: 12 },
});
