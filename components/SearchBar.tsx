import { StyleSheet, View, TextInput, ViewStyle, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { styles as textStyles } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

const width = 350;

type SearchBarProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  navigateOnPress?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  style,
  navigateOnPress = false,
}: SearchBarProps) {
  const router = useRouter();

  const handleClear = () => {
    onChangeText?.('');
  };

  if (navigateOnPress) {
    // ใช้เป็นปุ่ม navigate (home → search)
    return (
      <Pressable
        style={[styles.container, style]}
        onPress={() => router.push("/search")}
      >
        <MaterialIcons
          name="search"
          size={25}
          color={Colors.secondary}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[styles.input, textStyles.default]}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray1}
          editable={false}
          value={value}
          pointerEvents="none"
        />
      </Pressable>
    );
  }

  // ใช้เป็น search input จริง ๆ (หน้า Search)
  return (
    <View style={[styles.container, style]}>
      <MaterialIcons
        name="search"
        size={25}
        color={Colors.secondary}
        style={{ marginRight: 5 }}
      />
      <TextInput
        style={[styles.input, textStyles.default]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray1}
        value={value}
        onChangeText={onChangeText}
      />
      {value?.length > 0 && (
        <Pressable onPress={handleClear}>
          <MaterialIcons
            name="close"
            size={20}
            color={Colors.gray1}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: width,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});