import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";

interface StoreMarkerProps {
  icon: string;
  name: string;
  subtitle?: string;
  distance?: string;
  iconBgColor?: string;
}

export function StoreMarker({
  icon,
  name,
  subtitle,
  distance,
  iconBgColor = Colors.red,
}: StoreMarkerProps) {
  return (
    <View style={styles.storeMarker}>
      <View style={[styles.storeIcon, { backgroundColor: iconBgColor }]}>
        <ThemedText style={styles.storeIconText}>{icon}</ThemedText>
      </View>
      <View style={styles.storeInfo}>
        <ThemedText style={styles.storeName}>{name}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.storeSubtitle}>{subtitle}</ThemedText>
        )}
        {distance && (
          <ThemedText style={styles.storeDistance}>{distance}</ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  storeMarker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: 200,
  },
  storeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  storeIconText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.black,
  },
  storeSubtitle: {
    fontSize: 10,
    color: Colors.gray1,
  },
  storeDistance: {
    fontSize: 10,
    color: Colors.gray1,
  },
});
