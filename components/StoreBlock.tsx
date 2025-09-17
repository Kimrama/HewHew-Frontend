import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from "@/components/ThemedText";

type StoreBlockProps = {
  image: any;
  name: string;
  canteen: string;
  onPress: () => void;
};

const block_size = 105;

export function StoreBlock({ image, name, canteen, onPress }: StoreBlockProps) {
  return (
    <Pressable onPress={onPress} style={{ marginRight: 10 }}>
      <View>
        <Image source={image} style={styles.image} />
        <ThemedText
            style={{marginTop: 10, width: block_size}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {name}
        </ThemedText>

        <View style={{flexDirection: 'row', alignItems: "center"}}>
            <MaterialIcons name="location-pin" size={20} color={Colors.primary} style={{marginRight: 3}}/>
            <ThemedText
                style={{width: block_size-20}}
                numberOfLines={1}
                ellipsizeMode="tail">
                {canteen}
            </ThemedText>
        </View>
        
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: block_size,
    height: block_size,
    borderRadius: 20,
  },
});
