import React, { useRef, useState } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUTTON_WIDTH = 320
const DRAGGER_SIZE = 20;

export default function SwipeConfirmButton({
  label = "ยืนยันการส่ง",
  onSwipeComplete,
}: {
  label?: string;
  onSwipeComplete: () => void;
}) {
  const panX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const x = Math.max(0, Math.min(gestureState.dx, BUTTON_WIDTH - DRAGGER_SIZE));
        panX.setValue(x);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > BUTTON_WIDTH * 0.9) {
          onSwipeComplete();
          panX.setValue(BUTTON_WIDTH - DRAGGER_SIZE);
        } else {
          // รีเซ็ตกลับ
          Animated.spring(panX, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const backgroundWidth = Animated.add(panX, DRAGGER_SIZE / 2);

    return (
    <View style={styles.container}>
        {/* พื้นหลังไล่สีจากซ้ายไปกลางลูกศร */}
        <Animated.View style={[styles.background, { width: backgroundWidth }]} />

        {/* ข้อความตรงกลาง */}
        <ThemedText type="defaultSemiBold" style={styles.label}>{label}</ThemedText>

        {/* ลูกศร draggable */}
        <Animated.View
        {...panResponder.panHandlers}
        style={[styles.dragger, { transform: [{ translateX: panX }] }]}
        >
        <Ionicons name="chevron-forward" size={24} color={Colors.white} />
        </Animated.View>
    </View>
    );

}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH,
    height: 30,
    borderRadius: 30,
    backgroundColor: Colors.green,
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  label: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  dragger: {
    position: 'absolute',
    left: 0,
    width: DRAGGER_SIZE,
    height: '100%',
    borderRadius: DRAGGER_SIZE / 2,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
