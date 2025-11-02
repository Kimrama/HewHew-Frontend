import React, { useState, useRef } from "react";
import { Colors } from '@/constants/Colors';
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet, Pressable, Modal, TouchableOpacity } from "react-native";
import { formatDateTime, DeliveryMethodMap } from "./StatusBlock";
import { Image } from "react-native";

export type MenuItem = {
    name: string;
    detail: string;
    price: number;
    quantity: number;
}

type OrderTypeProp = {
  store: string;
  amount: number;
  canteen: string;
  menus: MenuItem[];
  orderPrice: number;
  name: string;
  address: string;
  addressDetail: string;
  deliveryMethod: string;
  appointmentTime: string;
  riderEarn: number;
  type?: string;
  index?: number;
  onRemove?: () => void;
  confirmImage: string;
};

export function OrderBlock({ name, canteen, store, appointmentTime, deliveryMethod, amount, menus, orderPrice, address, addressDetail, riderEarn, type = 'orderDatail', index, onRemove, confirmImage = '' }: OrderTypeProp) {

  return (
    <View>
        {/* header */}
        {type === 'confirmOrder' ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <ThemedText type="defaultSemiBold">รายการที่ {index}</ThemedText>

                <View style={{ flexDirection: 'row' }}>
                    {/* <View style={styles.amount}>
                        <ThemedText>{amount}</ThemedText>
                    </View>
                    <ThemedText style={{ paddingLeft: 10 }}>รายการ</ThemedText> */}
                    {onRemove && (
                        <Pressable onPress={onRemove} style={{ marginLeft: 10 }}>
                            <MaterialIcons name={"close"} size={20} color={Colors.red} />
                        </Pressable>
                    )}
                </View>
            </View>
        ) : null}

        {/* menu */}
        <View style={styles.container}>
            {/* hedaer */}
            <View style={{flexDirection: 'row'}}>
                <MaterialIcons name='store' size={20} style={{color: Colors.primary, paddingRight: 10}}></MaterialIcons>
                <ThemedText type='defaultSemiBold' style={{fontSize: 16}}>{store}</ThemedText>
            </View>

            {/* body */}
            <View>
                <View style={{gap: 6, width: 300}}>
                    {menus.map((item, index) => (
                        <MenuLine
                            key={index}
                            name={item.name}
                            detail={item.detail}
                            price={item.price}
                            quantity={item.quantity}
                        />
                    ))}
                </View>
                <View style={[styles.row, {paddingBottom: 0, paddingTop: 10}]}>
                    <ThemedText type='defaultSemiBold' style={{fontSize: 16}}>ราคารวม</ThemedText>
                    <ThemedText type='defaultSemiBold' style={{fontSize: 16}}>฿ {orderPrice}</ThemedText>
                </View>
            </View>
        </View>

        {/* address */}
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                <MaterialIcons name='location-pin' size={20} style={{color: Colors.primary, paddingRight: 10}}></MaterialIcons>
                <ThemedText type='defaultSemiBold' style={{fontSize: 16}}>{name}</ThemedText>
            </View>
            <ThemedText>{address}</ThemedText>
            <ThemedText>{addressDetail}</ThemedText>
        </View>

        {/* delivery */}
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                <MaterialIcons name='delivery-dining' size={20} style={{color: Colors.primary, paddingRight: 10}}></MaterialIcons>
                <ThemedText type='defaultSemiBold' style={{fontSize: 16}}>Delivery</ThemedText>
            </View>

            <View style={{gap: 2}}>
                <ThemedText>จัดส่งด้วยวิธี {DeliveryMethodMap[deliveryMethod]}</ThemedText>
                <ThemedText>วันที่ {formatDateTime(appointmentTime)}</ThemedText>
            </View>
            
            {type === "myDeliveryDetail" && (
                <View style={[styles.row, { paddingBottom: 0 }]}>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
                    ค่าส่งที่จะได้รับ
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
                    ฿ {riderEarn}
                    </ThemedText>
                </View>
                )}

            
        </View>
        {confirmImage && confirmImage !== '' && (
            <View style={{paddingTop: 10}}>
                <ThemedText type='subtitle' style={{paddingBottom: 10}}>หลักฐานการส่ง</ThemedText>
                <Image source={{ uri: confirmImage }} style={{ width: 350, height: 200,}} />
            </View>
        )}
    </View>
  );
}

function MenuLine({name, detail, price, quantity}: MenuItem){
    return (
    <View style={{flexDirection: "row", gap: 10}}>
        <ThemedText>{quantity}</ThemedText>
        <View style={{flexDirection: "column"}}>
            <View style={[styles.row, {paddingBottom: 2}]}>
                <ThemedText>{name}</ThemedText>
                <ThemedText>฿ {price*quantity}</ThemedText>
            </View>
            <ThemedText style={{fontSize: 13, color: Colors.gray1}}>{detail}</ThemedText> 
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: 350,
    alignItems: "flex-start",
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginVertical: 6,
    borderColor: Colors.gray2,
    borderWidth: 1,
  },
  row: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    paddingBottom: 6
  },
  amount: {
    height: 25,
    width: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: Colors.white
  },
});
