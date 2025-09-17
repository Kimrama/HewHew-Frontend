import { StyleSheet, View, TextInput, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { styles as textStyles } from '@/components/ThemedText';

const width = 335;

type SearchBarProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
};

export function SearchBar({
  value = '',
  onChangeText,
  placeholder = 'Search',
  style,
}: SearchBarProps) {
  const [text, setText] = useState(value);

  const handleChange = (input: string) => {
    setText(input);
    onChangeText?.(input);
  };

  return (
    <View style={[styles.container, style]}>
      <MaterialIcons
        name="search"
        size={25}
        color={Colors.secondary}
        style={{marginRight: 8,}}
      />
      <TextInput
        style={[styles.input, textStyles.default]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        value={text}
        onChangeText={handleChange}
      />
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
    elevation: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});
