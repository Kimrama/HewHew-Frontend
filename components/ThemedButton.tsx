import { Pressable, Text, StyleSheet, ViewStyle, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary";
  style?: ViewStyle;
};

export function ThemedButton({
  title,
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

  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient
        colors={gradients[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}>
          
        <ThemedText type="defaultSemiBold" style={{ color: textColors[variant] }}>
          {title}
        </ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 300,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
  },
});


// <ThemedButton title="ยืนยัน" variant="primary" onPress={() => {}} />