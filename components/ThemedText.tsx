import { StyleSheet, Text, type TextProps, TextStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "titleLarge" | "titleMd" |"defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        type === "default" ? styles.default : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "titleMd" ? styles.titleMd : undefined,
        type === "titleLarge" ? styles.titleLarge : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        { color },
        style, 
      ]}
      {...rest}
    />
  );
}


export const styles = StyleSheet.create<Record<string, TextStyle>>({
  default: {
    fontFamily: "Prompt_400Regular",
    fontSize: 14,
  },
  defaultSemiBold: {
    fontFamily: "Prompt_700Bold",
    fontSize: 14,
  },
  titleMd: {
    fontFamily: "Prompt_700Bold",
    fontSize: 22,
  },
  titleLarge: {
    fontFamily: "Prompt_700Bold",
    fontSize: 30,
  },
  subtitle: {
    fontFamily: "Prompt_500Medium",
    fontSize: 18,
  },
  link: {
    fontFamily: "Prompt_400Regular",
    fontSize: 16,
    color: "#0a7ea4",
    textDecorationLine: "underline",
  },
});
