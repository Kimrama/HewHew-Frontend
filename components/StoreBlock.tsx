import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from "@/components/ThemedText";

type StoreBlockProps = {
  image: any;
  name: string;
  canteen: string;
  widthSize?: number;
  heightSize?: number,
  onPress: () => void;
};

export function StoreBlock({
  image,
  name,
  canteen,
  onPress,
  widthSize = 105,
  heightSize = 105,
}: StoreBlockProps) {
  return (
    <Pressable onPress={onPress}>
      <View>
        <Image
          source={image}
          style={{ width: widthSize, height: heightSize, borderRadius: 20 }}
        />
        <ThemedText style={{ marginTop: 10, width: widthSize }} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="location-pin" size={20} color={Colors.primary} style={{ marginRight: 3 }} />
          <ThemedText style={{ width: widthSize - 20 }} numberOfLines={1} ellipsizeMode="tail">
            {canteen}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}