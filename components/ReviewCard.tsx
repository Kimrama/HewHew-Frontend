import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';

import { Image, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OtherUserTag } from './OtherUserTag';
import { RatingStars } from './RatingStars';

interface ReviewCardProps {
  id: string;
  username: string;
  rating: number;
  comment: string;
  otherUser: string;
  otherUserId: string;
  date: string | Date;
  avatarUrl?: string;
  otherUserAvatarUrl?: string;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

function timeAgo(dateString: string | Date): string {
  const now = new Date();
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export const ReviewCard = ({
  id,
  username,
  rating,
  comment,
  otherUser,
  date,
  avatarUrl,
  otherUserAvatarUrl,
  onEdit,
  onRemove,
}: ReviewCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}

        <View style={styles.userInfo}>
          <ThemedText style={styles.username}>{username}</ThemedText>
          <View style={styles.ratingRow}>
            <RatingStars rating={rating} size={16} />
            <ThemedText style={styles.dateThemedText}>{timeAgo(date)}</ThemedText>
          </View>
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.menuButton}
        >
          <ThemedText style={styles.menuThemedText}>⋮</ThemedText>
        </Pressable>
      </View>

      {comment ? <ThemedText style={styles.commentThemedText}>{comment}</ThemedText> : null}

      <OtherUserTag name={otherUser} avatarUrl={otherUserAvatarUrl} />

      {/* Modal Popup */}
      <Modal
  visible={modalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
  statusBarTranslucent={true} // เพิ่มถ้าใช้ Android และอยากให้ status bar ทึบโปร่ง
>
  {/* Overlay ด้านนอก */}
  <Pressable
    style={styles.modalOverlay}
    onPress={() => setModalVisible(false)}
  >
    {/* หลีกเลี่ยงการปิด modal เมื่อกดภายใน */}
    <Pressable style={styles.actionSheetWrapper} onPress={(e) => e.stopPropagation()}>
      {/* SafeAreaView คุม safe area ด้านล่างและบน */}
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'transparent' }}>
        {/* กลุ่ม Edit / Remove */}
        <View style={styles.actionSheetContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonTop]}
            onPress={() => {
              setModalVisible(false);
              onEdit(id);
            }}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.actionText}>Edit</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonBottom]}
            onPress={() => {
              setModalVisible(false);
              onRemove(id);
            }}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.actionText, styles.deleteThemedText]}>Remove</ThemedText>
          </TouchableOpacity>
        </View>

        {/* กลุ่ม Cancel */}
        <View style={[styles.actionSheetContainer, styles.cancelContainer]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonBottom]}
            onPress={() => setModalVisible(false)}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.actionText, styles.cancelThemedText]}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Pressable>
  </Pressable>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateThemedText: {
    marginLeft: 8,
    color: '#888',
    fontSize: 12,
  },
  commentThemedText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  menuThemedText: {
    fontSize: 18,
    color: '#666',
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },

  actionSheetWrapper: {
    paddingHorizontal: 8,
  },

  actionSheetContainer: {
    backgroundColor: '#fefefe',
    borderRadius: 15,
    marginBottom: 8, 
    overflow: 'hidden',


    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },

  cancelContainer: {
    marginBottom: 16, 
  },

  actionButton: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },

  actionButtonTop: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  actionButtonBottom: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  actionText: {
    fontSize: 18,
    color: Colors.green,
    //'#007aff'
  },

  deleteThemedText: {
    color: '#ff3b30',
  },

  cancelThemedText: {
    fontWeight: '700',
  },
});
