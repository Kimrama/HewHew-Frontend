import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  ColorValue,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type ThemedButtonProps = {
  title: string;
  title2?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "delete";
  style?: ViewStyle;
  disabled?: boolean;
};

export function ThemedButton({
  title,
  title2 = "",
  onPress,
  variant = "primary",
  style,
  disabled = false,
}: ThemedButtonProps) {
  const gradients: Record<
    NonNullable<ThemedButtonProps["variant"]>,
    readonly [ColorValue, ColorValue, ...ColorValue[]]
  > = {
    primary: [Colors.primary, Colors.green],
    secondary: [Colors.secondary, Colors.cream],
    tertiary: ["#84B3A2", "#BCDCBA"],
    delete: [Colors.red, Colors.red],
  };

  const textColors: Record<
    NonNullable<ThemedButtonProps["variant"]>,
    string
  > = {
    primary: Colors.white,
    secondary: Colors.primary,
    tertiary: Colors.white,
    delete: Colors.white,
  };
  const isSingle = title2 === "";

  return (
    <Pressable onPress={onPress} style={style} disabled={disabled}>
      <LinearGradient
        colors={gradients[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          isSingle ? styles.buttonSingle : styles.buttonDouble,
          disabled && styles.disabled,
        ]}
      >
        {isSingle ? (
          <ThemedText
            type="defaultSemiBold"
            style={{ color: textColors[variant] }}
          >
            {title}
          </ThemedText>
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <ThemedText
              type="defaultSemiBold"
              style={{ color: textColors[variant] }}
            >
              {title}
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              style={{ color: textColors[variant] }}
            >
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
    justifyContent: "space-between",
  },
  disabled: {
    opacity: 0.5,
  },
});
