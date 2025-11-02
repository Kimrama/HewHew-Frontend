import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface OtherUserTagProps {
  name: string;
  avatarUrl?: string;
}

export const OtherUserTag = ({ name, avatarUrl }: OtherUserTagProps) => {
  return (
    <View style={styles.container}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
      <ThemedText style={styles.name}>{name}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    //#0c876eff
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#BDBDBD',
  },
  name: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
});
