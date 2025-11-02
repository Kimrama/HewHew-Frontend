import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ThemedText } from "./ThemedText";

// ---------- Define Type for CartItem ----------
export interface CartItemType {
  menu_id: string;
  storeName?: string;
  name: string;
  detail?: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, delta: number) => void;
  deleteItem: (id: string) => void;
  closeOthers?: (ref: React.RefObject<Swipeable | null>) => void;
}

// ---------- Component ----------
export default function CartItem({
  item,
  updateQuantity,
  deleteItem,
  closeOthers,
}: CartItemProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = () => (
    <Pressable
      style={styles.deleteButton}
      onPress={() => {
        swipeableRef.current?.close();
        Alert.alert("ลบรายการ", "คุณต้องการลบสินค้านี้ใช่หรือไม่?", [
          { text: "ยกเลิก", style: "cancel" },
          {
            text: "ลบ",
            style: "destructive",
            onPress: () => deleteItem(item.menu_id),
          },
        ]);
      }}
    >
      <MaterialIcons name="delete" size={32} color="white" />
    </Pressable>
  );

  const imageSource = item.image_url
    ? { uri: item.image_url }
    : require("../assets/images/default-featured-image.jpg");

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={() => {
        if (closeOthers) closeOthers(swipeableRef);
      }}
    >
      <View style={styles.cartItem}>
        <Image source={imageSource} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <ThemedText style={styles.itemDescription}>{item.detail}</ThemedText>
          <ThemedText style={styles.itemPrice}>฿ {item.price}</ThemedText>
          <View style={styles.quantityControl}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.menu_id, -1)}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </Pressable>
            <Text style={styles.qtyNumber}>{item.quantity}</Text>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.menu_id, 1)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  cartItem: {
    height: 90, // Reduced height to match smaller image
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12, // Adjusted padding to match the image
    marginBottom: 12,
    elevation: 2,
    position: "relative", // Required for absolute positioning of quantity control
  },
  itemImage: {
    width: 60, // Smaller image size
    height: 60,
    borderRadius: 8,
    resizeMode: "contain",
    marginRight: 12, // Adjusted margin
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: "600",
    fontSize: 16, // Adjusted font size to match image
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12, // Smaller font size
    color: "#555",
    marginBottom: 4,
  },
  itemPrice: {
    fontWeight: "bold",
    color: "#2a4d36",
  },
  quantityControl: {
    position: "absolute", // Absolute positioning for bottom-right corner
    bottom: 0, // Align at the bottom with some space
    right: 0, // Align at the right side with some space
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2a4d36", // Green border color
    borderRadius: 20, // Rounded pill shape

    marginHorizontal: 12,
  },
  qtyBtn: {
    backgroundColor: "transparent", // Transparent background for buttons
    borderRadius: 20, // Match pill shape
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  qtyBtnText: {
    color: "#2a4d36", // Green color for button text
    fontSize: 20,
    fontWeight: "bold",
  },
  qtyNumber: {
    fontSize: 12, // Adjust font size for quantity number
    fontWeight: "bold",
    color: "#2a4d36", // Green color for quantity number
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 60, // Round button size
    height: 90, // Made the delete button round
    position: "absolute",
    borderRadius: 16,
    elevation: 5, // Optional: to create a shadow effect
  },
});
