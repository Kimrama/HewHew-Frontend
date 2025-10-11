import React, { useState, useRef, useContext } from "react";
import { Colors } from '@/constants/Colors';
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from '@expo/vector-icons';
import { View, Image, StyleSheet, Pressable } from "react-native";
import { Redirect, router } from "expo-router";
import { AuthContext } from "@/store/auth-context";

type MenuBlockProps = {
  name: string;
  price: number;
  imageUrl: string;
  info: string;
  tag1?: string;
  tag2?: string;
  count: number;
  onCountChange: (menuName: string, newCount: number) => void;
};

export function MenuBlock({ name, info, price, imageUrl, count, onCountChange }: MenuBlockProps) {
  const [isActive, setIsActive] = useState(false);
  const [isMinus, setIsMinus] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDefaultActive = count > 0 && !isActive;
  const { isAuthenticated, logout, token } = useContext(AuthContext);

  const resetTimeout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsActive(false), 2000);
  };

  const handleAddPress = () => {
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }
    if (!isActive && count === 0) {
      // first click
      setIsActive(true);
      onCountChange(name, 1); 
      setIsMinus(false);
      resetTimeout();
    } else if (!isActive && count > 0) {
      // reopen row
      setIsActive(true);
      setIsMinus(true);
      resetTimeout();
    } else {
      // in row
      onCountChange(name, count + 1);
      setIsMinus(true);
      resetTimeout();
    }
  };

  const handleDeletePress = () => {
    const newCount = count - 1;
    if (newCount <= 0) {
      setIsActive(false);
      setIsMinus(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      setIsMinus(newCount > 1);
      resetTimeout();
    }
    onCountChange(name, Math.max(newCount, 0));
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <View style={styles.infoContainer}>
          <ThemedText style={styles.name}>{name}</ThemedText>
          <ThemedText>{info}</ThemedText>
          <ThemedText style={styles.price}>฿ {price}</ThemedText>
        </View>

        <View style={{ position: 'absolute', right: 2, bottom: 2}}>
          {!isActive && !isDefaultActive ? (
            <Pressable onPress={handleAddPress}>
              <MaterialIcons name="add-circle" size={30} color={Colors.primary} />
            </Pressable>
          ) : !isActive && isDefaultActive ? (
            <Pressable onPress={handleAddPress}>
              <View style={styles.countBoxDefault}>
                <ThemedText style={styles.countText}>{count}</ThemedText>
              </View>
            </Pressable>
          ) : (
            <View style={styles.row}>
              <Pressable onPress={handleDeletePress}>
                <MaterialIcons name={isMinus ? "remove" : "delete"} size={20} color={Colors.primary} />
              </Pressable>
              <View style={styles.countBox}>
                <ThemedText style={styles.countText}>{count}</ThemedText>
              </View>
              <Pressable onPress={handleAddPress}>
                <MaterialIcons name="add" size={20} color={Colors.primary} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginVertical: 6,
    marginHorizontal: 10,
    borderColor: Colors.gray2,
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    gap: 6
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primary,
  },
  row: {
    height: 27,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 6,
  },
  countBox: {
    marginHorizontal: 2,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  countBoxDefault: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});
