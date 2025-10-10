import { Pressable, Text, StyleSheet, ViewStyle, ColorValue, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

type ThemedButtonProps = {
  title: string;
  title2?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary" | 'white';
  style?: ViewStyle;
};

export function ThemedButton({
  title,
  title2 = '',
  onPress,
  variant = "primary",
  style,
}: ThemedButtonProps) {
  const gradients: Record<
    NonNullable<ThemedButtonProps["variant"]>,
    readonly [ColorValue, ColorValue, ...ColorValue[]]
  > = {
    primary: [Colors.primary, Colors.green],
    secondary: [Colors.secondary, Colors.cream],
    tertiary: ["#84B3A2", "#BCDCBA"],
  };

  const textColors: Record<NonNullable<ThemedButtonProps["variant"]>, string> = {
    primary: Colors.white,
    secondary: Colors.primary,
    tertiary: Colors.white,
  };
  const isSingle = title2 === "";

  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient
        colors={gradients[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={isSingle ? styles.buttonSingle : styles.buttonDouble}
      >
        {isSingle ? (
          <ThemedText type="defaultSemiBold" style={{ color: textColors[variant] }}>
            {title}
          </ThemedText>
        ) : (
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <ThemedText type="defaultSemiBold" style={{ color: textColors[variant] }}>
              {title}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={{ color: textColors[variant] }}>
              {title2}
            </ThemedText>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonSingle: {
    width: 350,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonDouble: {
    width: 350,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: 'space-between'
  },
});