import { SafeAreaView, StyleSheet, ScrollView, View, Pressable, Image, FlatList, ListRenderItem } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRef, useState, useEffect } from "react";
import { HorizontalTags } from "@/components/HorizontalTags";
import { MenuBlock } from "@/components/MenuBlock";

const width = 412;
const default_image = require('@/assets/images/default-featured-image.jpg')

const styles = StyleSheet.create({
});

export default function notifications() {
    return (
        <LinearGradient
          colors={Colors.bg}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
        <SafeAreaView style={{ flex: 1}}>
        </SafeAreaView>
    </LinearGradient>
    );
}