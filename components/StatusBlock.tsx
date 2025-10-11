import React, { useState, useRef } from "react";
import { Colors } from '@/constants/Colors';
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet, Pressable, Modal, TouchableOpacity } from "react-native";

type StatusBlockProps = {
  name: string;
  canteen: string;
  store: string;
  appointmentTime: string;
  deliveryMethod: string;
  amount: number;
  price: number
  status: string;
  type: string;
};

const statusMap: Record<string, string> = {
  "delivered": "จัดส่งสำเร็จ",
  "pending": "รอการจัดส่ง",
  "searching": "กำลังหาผู้จัดส่ง",
};

const TypeTextMap: Record<string, string> = {
  "receiver": "จัดส่งโดย",
  "rider": "สั่งซื้อโดย"
}

export const DeliveryMethodMap: Record<string, string> = {
  "FacetoFace": "Face To Face",
  "dropOff": "Drop Off"
}

export function StatusBlock({ name, canteen, store, appointmentTime, deliveryMethod, amount, price, status, type }: StatusBlockProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(status);
    const statuses = ["delivered", "pending", "searching"];

    const getStatusColor = (status: string) => {
    switch(status) {
      case "delivered": return Colors.primary;
      case "pending": return Colors.secondary;
      case "searching": return Colors.red;
      default: return Colors.gray1;
    }
  }

  return (
    <View style={styles.container}>
        {/* head */}
        <View style={styles.rowHead}>
            <ThemedText type='subtitle'>{store}</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.amount}>
                    <ThemedText>{amount}</ThemedText>
                </View>
                <ThemedText style={{ marginLeft: 10 }}>รายการ</ThemedText>
            </View>
        </View>

        {/* body */}
        <View style={{gap: 4}}>
            {type === "rider" ? (
                <ThemedText type='subtitle' style={{fontSize: 16, color: Colors.primary}}>+ ฿ {price}</ThemedText>
            ) : null}
            <View style={styles.row}>
                <MaterialIcons name='location-pin' size={15} color={Colors.green}></MaterialIcons>
                <ThemedText style={{  marginLeft: 10 }}>{canteen}</ThemedText>
            </View>

            {/* <View style={styles.row}>
                <MaterialIcons name='person' size={15} color={Colors.green}></MaterialIcons>
                <ThemedText style={{ paddingLeft: 10}}>{name}</ThemedText>
            </View> */}

            <View style={styles.row}>
                <MaterialIcons name='access-time-filled' size={15} color={Colors.green}></MaterialIcons>
                <ThemedText style={{  marginLeft: 10 }}>{formatDateTime(appointmentTime)}</ThemedText>
            </View>

            <View style={styles.row}>
                <MaterialIcons
                    name={
                    deliveryMethod === 'FacetoFace' ? 'group' :
                    deliveryMethod === 'dropOff' ? 'hail' : 'no-crash'}
                    size={15}
                    color={Colors.green}
                />
                <ThemedText style={{  marginLeft: 10 }}>{DeliveryMethodMap[deliveryMethod]}</ThemedText>
            </View>  
        </View>

        <ThemedText style={{marginTop: 6}}>{TypeTextMap[type]} {name}</ThemedText>

        {/* bottom */}
        <ThemedText type='defaultSemiBold' style={{marginTop: 6, fontSize: 16}}>Order Total : ฿ {price}</ThemedText>
    
        {/* status */}
        {type === "rider" && status === 'pending' ? (
            <>
            <Pressable style={[styles.status, { backgroundColor: getStatusColor(currentStatus), elevation: 3}]} onPress={() => setModalVisible(true)}>
                <ThemedText type="defaultSemiBold" style={{ color: Colors.white }}>{statusMap[currentStatus]}</ThemedText>
                <MaterialIcons name='edit' style={{color: Colors.white, paddingLeft: 4}}></MaterialIcons>
            </Pressable>

            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                style={styles.modalBackground}
                onPress={() => setModalVisible(false)}
                >
                <View style={styles.dropdown}>
                    {statuses.map((s) => (
                    <TouchableOpacity
                        key={s}
                        style={styles.dropdownItem}
                        onPress={() => {
                        setCurrentStatus(s);
                        setModalVisible(false);
                        }}
                    >
                        <ThemedText>{statusMap[s]}</ThemedText>
                    </TouchableOpacity>
                    ))}
                </View>
                </Pressable>
            </Modal>
            </>
        ) : (
            <View style={[styles.status, { backgroundColor: getStatusColor(currentStatus) }]}>
            <ThemedText type="defaultSemiBold" style={{ color: Colors.white }}>
                {statusMap[currentStatus]}
            </ThemedText>
            </View>
        )}
    </View>
  );
}

export function formatDateTime(isoString: string) {
  const date = new Date(isoString);

  const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes} น.`;
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    alignItems: "flex-start",
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginVertical: 6,
    marginHorizontal: 10,
    borderColor: Colors.gray2,
    borderWidth: 1,
  },
  rowHead: {
    width: 320,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    paddingBottom: 6
  },
  row: {
    width: 320,
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    height: 25,
    width: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primary,
    borderWidth: 1
  },
  status: {
    flexDirection: 'row',
    position: 'absolute',
    right: 12,
    bottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 6,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 10,
    width: 200,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
