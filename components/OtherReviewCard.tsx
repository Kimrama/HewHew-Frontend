import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { Image, StyleSheet, View, Pressable } from 'react-native';
import { RatingStars } from './RatingStars';
import { useRouter } from 'expo-router';

interface OtherReviewCardProps {
  id: string;
  username: string; // rider's name
  rating: number;
  comment: string;
  date: string | Date;
  avatarUrl?: string; // rider's avatar
  userId?: string; // ✅ เพิ่ม userId สำหรับลิงก์ไปหน้าโปรไฟล์
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

export const OtherReviewCard = ({
  id,
  username,
  rating,
  comment,
  date,
  avatarUrl,
  userId,
}: OtherReviewCardProps) => {
  const router = useRouter();

  // ✅ ฟังก์ชันกดเข้าโปรไฟล์
  const handleProfilePress = () => {
    if (userId) {
      router.push(`/otherProfile?userId=${userId}`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {/* ✅ รูปโปรไฟล์กดได้ */}
        <Pressable onPress={handleProfilePress}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </Pressable>

        <View style={styles.userInfo}>
          {/* ✅ ชื่อกดได้ */}
          <Pressable onPress={handleProfilePress}>
            <ThemedText style={styles.username}>{username}</ThemedText>
          </Pressable>

          <View style={styles.ratingRow}>
            <RatingStars rating={rating} size={16} />
            <ThemedText style={styles.dateThemedText}>{timeAgo(date)}</ThemedText>
          </View>
        </View>
      </View>

      {comment ? <ThemedText style={styles.commentThemedText}>{comment}</ThemedText> : null}
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
});
