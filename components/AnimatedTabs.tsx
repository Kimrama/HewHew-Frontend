import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { ThemedText } from './ThemedText';

const { width } = Dimensions.get('window');

interface AnimatedTabsProps<T extends string> {
  options: readonly { key: T; label: string }[]; // <--- เพิ่ม readonly
  selected: T;
  setSelected: (val: T) => void;
  containerMarginHorizontal?: number;
}

function AnimatedTabs<T extends string>({
  options,
  selected,
  setSelected,
  containerMarginHorizontal = 16,
}: AnimatedTabsProps<T>) {
  const translateX = useRef(new Animated.Value(0)).current;
  const TAB_WIDTH = (width - containerMarginHorizontal * 2) / options.length;

  useEffect(() => {
    const index = options.findIndex((o) => o.key === selected);
    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  }, [selected]);

  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: containerMarginHorizontal,
          borderRadius: 24,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            width: TAB_WIDTH - 8,
            transform: [{ translateX }],
            margin: 4,
          },
        ]}
      />
      {options.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[styles.tab, { width: TAB_WIDTH }]}
          onPress={() => setSelected(option.key)}
        >
          <ThemedText
            style={[
              styles.tabThemedText,
              selected === option.key && styles.tabThemedTextSelected,
            ]}
          >
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default AnimatedTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  tab: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabThemedText: {
    fontSize: 14,
    color: '#555',
  },
  tabThemedTextSelected: {
    color: Colors.green,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 24,
    zIndex: -1,
  },
});
