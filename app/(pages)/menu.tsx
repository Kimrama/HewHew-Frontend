import { SafeAreaView, StyleSheet, ScrollView, View, Pressable, Image, FlatList, ListRenderItem } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { SearchBar } from '@/components/SearchBar';
import { StoreBlock } from '@/components/StoreBlock';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { sampleStores } from "@/sampleData/sample";
import { CanteenList } from "@/components/CanteenList";
import { useRef, useState } from "react";

const width = 395;

const styles = StyleSheet.create({
    headerImg: {
        height: 150,
        width: width,
        position: "relative"
    },
    storeImg: {
        height: "100%",
        width: "100%"
    },
    Overlay: {
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    headerName: {
        position: "absolute",
        top: 35,
        left: 30,
        color: Colors.white
    },
    headerIcon: {
        color: Colors.secondary,
        marginRight: 20,
        position: "absolute",
        top: 80,
        left: 30
    },
    headerCanteen: {
        position: "absolute",
        top: 85,
        left: 60,
        color: Colors.white
    }
});

export default function Login() {
    const { state, image, name , canteen } = useLocalSearchParams();
    const imgUri = Array.isArray(image) ? image[0] : image;
    const isOpen = state === "true";

    return (
        <LinearGradient
          colors={Colors.bg}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.headerImg}>
                <Image
                    source={{ uri: imgUri }}
                    style={styles.storeImg}
                />
                <View style={styles.Overlay}></View>
                <ThemedText type='titleMd' style={styles.headerName}>{name}</ThemedText>
                <MaterialIcons
                    name="location-pin"
                    size={25}
                    style={styles.headerIcon}
                />
                <ThemedText style={styles.headerCanteen}>{canteen}</ThemedText>
            </View>

            <View style={{paddingVertical: 30}}>
                <SearchBar placeholder="Search Menu, Store or Canteen" />
            </View>

          </SafeAreaView>
        </LinearGradient>
      );
}