import { getMenubyId } from "@/api/store";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { formatDateTime } from "./StatusBlock";

export const OrderCard: React.FC<Props> = ({ order, isExpanded, onToggle }) => {
  const [menuDetails, setMenuDetails] = useState<Menu[]>([]);

  // ดึงข้อมูลเมนูเมื่อ order เปลี่ยนแปลง
  useEffect(() => {
    const fetchMenuDetails = async () => {
      const menuData = await Promise.all(
        order.menu_quantity.map(async (item) => {
          const menu = await getMenubyId(item.menu_id); // ใช้ menu_id ในการดึงข้อมูลเมนู
          return menu ? menu : { name: "", price: 0, detail: "", image_url: "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg" }; // กรณีที่เมนูไม่พบ ให้ใช้ค่าดีฟอลต์
        })
      );
      setMenuDetails(menuData); // เก็บข้อมูลเมนูทั้งหมดใน state
    };

    fetchMenuDetails();
  }, [order]);

  // ฟังก์ชันนี้จะใช้สำหรับดึงข้อมูลเมนูจากเมนูที่มีใน state
  const getItemDetails = (menuId: string) => {
    const menu = menuDetails.find((item) => item.menu_id === menuId);
    return menu ? { name: menu.name, price: menu.price, detail: menu.detail, image_url: menu.image_url } : { name: "", price: 0, detail: "", image_url: "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg" }; // คืนชื่อ, ราคา, รายละเอียดของเมนู และ URL รูปภาพ
  };

  return (
    <View style={styles.cardWrapper}>
      {/* Header */}
      <Pressable style={styles.card} onPress={() => router.push(`/(tabs)/order/orderDetail?orderId=${order.order_id}`)}>
        <View style={styles.leftContent}>
          <ThemedText style={styles.storeName}>{order.shop_name}</ThemedText>
          <ThemedText style={styles.bonus}>+ ฿ {order.shipping_fee}</ThemedText>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color="#0A6847" />
            <ThemedText style={styles.infoThemedText}>{order.canteen_name}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={16} color="#0A6847" />
            <ThemedText style={styles.infoThemedText}>{formatDateTime(order.appointment_time)}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="groups" size={16} color="#0A6847" />
            <ThemedText style={styles.infoThemedText}>{order.delivery_method}</ThemedText>
          </View>

          <ThemedText style={styles.OrderTotal}>Order Total : {order.amount}</ThemedText>
        </View>

        {/* ใช้รูปภาพจากเมนูแรกหากมี */}
        <Image
          source={{ uri: menuDetails[0]?.image_url || "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg" }}
          style={styles.image}
        />
      </Pressable>

      {/* Expanded Section */}
      {isExpanded && (
        <View style={styles.expandedSection}>
          {order.menu_quantity.map((item) => {
            const { name, price, detail, image_url } = getItemDetails(item.menu_id);
            return (
              <View key={item.menu_id} style={styles.itemCard}>
                <Image
                  source={{ uri: image_url }}
                  style={styles.itemImage}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <ThemedText style={styles.itemName}>{name}</ThemedText>
                  <ThemedText style={styles.itemDesc}>{detail}</ThemedText>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <ThemedText style={styles.itemPrice}>฿ {price}</ThemedText>
                  <ThemedText style={styles.itemQty}>x{item.quantity}</ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Expand Button */}
      <Pressable style={styles.expandBar} onPress={onToggle}>
        <MaterialIcons
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={28}
          color="#000"
        />
        <ThemedText style={styles.itemCountThemedText}>{order.menu_quantity.length} รายการ</ThemedText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "#CDE9D4",
    borderRadius: 15,
    marginBottom: 12,
    width: 350,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    width: '100%',
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
  },
  bonus: {
    fontSize: 16,
    color: "#0A6847",
    fontWeight: "700",
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  infoThemedText: {
    color: "#444",
    marginLeft: 5,
  },
  OrderTotal: {
    color: "#000000ff",
    fontWeight: "700",
    marginTop: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  expandedSection: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 0,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  itemImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  itemName: {
    fontWeight: "600",
    color: "#000",
  },
  itemDesc: {
    color: "#777",
    fontSize: 12,
  },
  itemPrice: {
    color: "#0A6847",
    fontWeight: "600",
  },
  itemQty: {
    color: "#000",
    fontWeight: "500",
  },
  expandBar: {
    backgroundColor: "#CDE9D4",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: "relative",
    width: '100%', // เพิ่มความกว้างเต็ม
  },
  itemCountThemedText: {
    position: "absolute",
    right: 16,
    color: "#000",
    fontWeight: "600",
  },
});
