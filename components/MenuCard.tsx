import { Menu } from "@/api/store";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface MenuCardProps {
  menu: Menu & { quantity: number };
}

export function MenuCard({ menu }: MenuCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: menu.image_url || undefined }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <ThemedText style={styles.name}>{menu.name}</ThemedText>
        <ThemedText style={styles.description} numberOfLines={2}>
          {menu.detail}
        </ThemedText>
        <View style={styles.footer}>
          <ThemedText style={styles.price}>฿{menu.price}</ThemedText>
          <ThemedText style={styles.quantity}>x{menu.quantity}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: Colors.gray1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  quantity: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
