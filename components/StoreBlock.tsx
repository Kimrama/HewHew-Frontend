import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";

type StoreBlockProps = {
  state: boolean;
  image: { uri: string };
  name: string;
  canteen: string;
  widthSize?: number;
  heightSize?: number;
};

export function StoreBlock({
  state,
  image,
  name,
  canteen,
  widthSize = 105,
  heightSize = 105,
}: StoreBlockProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(pages)/menu",
      params: {
        states: state ? "true" : "false",
        image: image.uri,
        name,
        canteen,
      },
    });
  };        

  return (
    <Pressable onPress={handlePress}>
      <View>
        {/* รูปภาพ */}
        <View style={{ position: "relative" }}>
          <Image
            source={image}
            style={{ width: widthSize, height: heightSize, borderRadius: 20 }}
          />

          {/* ถ้า state == false ให้ overlay สีเทา */}
          {!state && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: widthSize,
                height: heightSize,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedText
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Close
              </ThemedText>
            </View>
          )}
        </View>
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
