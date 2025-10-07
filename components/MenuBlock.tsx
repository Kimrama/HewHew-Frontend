import React, { useState, useRef, useEffect } from "react";
import { Colors } from '@/constants/Colors';
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from '@expo/vector-icons';

import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";

type MenuBlockProps = {
  name: string;
  price: number;
  imageUrl: string;
  tag1: string;
  tag2: string;
};

export function MenuBlock({ name, price, imageUrl, tag1, tag2 }: MenuBlockProps) {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMinus, setIsMinus] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countRef = useRef(count);
  const isMinusRef = useRef(isMinus);
  const isDefaultActive = count > 0 && !isActive;
  
  useEffect(() => { countRef.current = count }, [count]);
  useEffect(() => { isMinusRef.current = isMinus }, [isMinus]);

  const resetTimeout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
    setIsActive(false); 
    }, 2000);
  };

  const handleAddPress = () => {
    if (!isActive) {
        setIsActive(true);
        setCount(1);
        setIsMinus(false);
        resetTimeout();
    } else {
        setCount(prev => prev + 1);
        setIsMinus(true);
        resetTimeout();
    }
    };

  const handleDeletePress = () => {
  if (isMinus) {
    const newCount = count - 1;
    setCount(newCount);
    setIsActive(newCount > 0);
    if (newCount <= 0) {
      setIsMinus(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      resetTimeout();
    }
  } else {
    setIsActive(false);
    setCount(0);
    setIsMinus(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }
};

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.infoContainer}>
        <ThemedText style={styles.name}>{name}</ThemedText>

        {/* Tags */}
        <View style={styles.tagRow}>
          {tag1 ? (
            <View style={styles.tag}>
              <ThemedText style={styles.tagText}>{tag1}</ThemedText>
            </View>
          ) : null}
          {tag2 ? (
            <View style={styles.tag}>
              <ThemedText style={styles.tagText}>{tag2}</ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText style={styles.price}>฿ {price}</ThemedText>
      </View>

      {/* Add Button*/}
      {!isActive && !isDefaultActive ? (
      // default add-circle
      <Pressable onPress={handleAddPress}>
        <MaterialIcons name="add-circle" size={30} color={Colors.primary} />
      </Pressable>
        ) : !isActive && isDefaultActive ? (
        <Pressable onPress={handleAddPress}>
            <View style={styles.countBoxDefault}>
                <ThemedText>{count}</ThemedText>
            </View>
        </Pressable>
        ) : (
        <View style={styles.row}>
          <Pressable onPress={handleDeletePress}>
            <MaterialIcons name={isMinus ? "remove" : "delete"} size={20} color="#fff" />
          </Pressable>
          <View style={styles.countBox}>
            <ThemedText style={styles.countText}>{count}</ThemedText>
          </View>
          <Pressable onPress={handleAddPress}>
            <MaterialIcons name="add" size={20} color="#fff" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginVertical: 6,
    marginHorizontal: 10,
    borderColor: '#D9D9D9',
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  tag: {
    backgroundColor: Colors.white,
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 10
  },
  tagText: {
    fontSize: 12,
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primary,
  },
  row: {
    height: 27,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 0,
  },
  countBox: {
    marginHorizontal: 2,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    color: "#fff",
    fontWeight: "700",
  },
  countBoxDefault: {
  width: 27,
  height: 27,
  borderRadius: 13.5,
  borderWidth: 1,
  borderColor: Colors.primary,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
},

});
