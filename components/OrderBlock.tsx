import React, { useState, useRef } from "react";
import { Colors } from '@/constants/Colors';
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet, Pressable, Modal, TouchableOpacity } from "react-native";
import { MenuItem } from "@/sampleData/sampleOrder";
import { formatDateTime, DeliveryMethodMap } from "./StatusBlock";

type OrderTypeProp = {
  store: string;
  amount: number;
  canteen: string;
  menus: MenuItem[];
  orderPrice: number;
  name: string;
  address: string;
  deliveryMethod: string;
  appointmentTime: string;
  riderEarn: number;
  type?: string;
  index?: number;
};

export function OrderBlock({ name, canteen, store, appointmentTime, deliveryMethod, amount, menus, orderPrice, address, riderEarn, type = 'orderDatail', index }: OrderTypeProp) {

  return (
    <View>
        {/* header */}
        {type === 'confirmOrder' ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <ThemedText type="defaultSemiBold">รายการที่ {index}</ThemedText>

                <View style={{ flexDirection: 'row' }}>
                <View style={styles.amount}>
                    <ThemedText>{amount}</ThemedText>
                </View>
                <ThemedText style={{ paddingLeft: 10 }}>รายการ</ThemedText>
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
                <View style={{gap: 6}}>
                    {menus.map((item, index) => (
                        <MenuLine
                            key={index}
                            name={item.name}
                            detail={item.detail}
                            price={item.price}
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
            
            <View style={[styles.row, {paddingBottom: 0}]}>
                <ThemedText type='defaultSemiBold' style={{fontSize: 16}}>ค่าส่งที่จะได้รับ</ThemedText>
                <ThemedText type='defaultSemiBold' style={{fontSize: 16}}>฿ {riderEarn}</ThemedText>
            </View>
        </View>
    </View>
  );
}

function MenuLine({name, detail, price}: MenuItem){
    return (
    <View>
        <View style={[styles.row, {paddingBottom: 2}]}>
            <ThemedText>{name}</ThemedText>
            <ThemedText>฿ {price}</ThemedText>
        </View>
        <ThemedText style={{fontSize: 13, color: Colors.gray1}}>{detail}</ThemedText> 
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
    width: 320,
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
