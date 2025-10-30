import React from "react";
import { Colors } from '@/constants/Colors';
import { ThemedText } from "@/components/ThemedText";

import {
  View,
  FlatList,
  Text,
  Pressable,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";

type HorizontalTagsProps = {
  tags: string[];
  onPressTag?: (tag: string) => void;
  selectedTag?: string | null;
  chipWidth?: number;
};

export function HorizontalTags({
  tags,
  onPressTag,
  selectedTag = null,
  chipWidth,
}: HorizontalTagsProps) {
  const renderItem = ({ item }: ListRenderItemInfo<string>) => {
    const isSelected = selectedTag === item;
    return (
      <Pressable
        onPress={() => onPressTag?.(item)}
        style={[
          styles.chip,
          isSelected && styles.chipSelected,
          chipWidth ? { width: chipWidth } : undefined,
        ]}
      >
        <ThemedText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.chipText, isSelected && styles.chipTextSelected]}
        >
          {item}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tags}
        keyExtractor={(item, idx) => `${item}-${idx}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  listContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderColor: Colors.green,
    marginRight: 8,
    borderWidth: 1,
    minWidth: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: Colors.green,
    shadowColor: "#000",
    borderColor: "transparent",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chipText: {
    fontSize: 13,
    color: "#333",
  },
  chipTextSelected: {
    color: Colors.white,
    fontWeight: "600",
  },
});
