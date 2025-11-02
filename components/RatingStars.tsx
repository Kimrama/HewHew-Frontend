// import { MaterialIcons } from '@expo/vector-icons';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';

// interface RatingStarsProps {
//   rating: number; // 0–5
//   size?: number;
// }

// export const RatingStars = ({ rating, size = 16 }: RatingStarsProps) => {
//   return (
//     <View style={styles.container}>
//       {Array.from({ length: 5 }).map((_, i) => (
//         <MaterialIcons
//           key={i}
//           name="star"
//           size={size}
//           color={i < rating ? '#FFC107' : '#E0E0E0'}
//         />
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//   },
// });
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // ใช้ FontAwesome

interface RatingStarsProps {
  rating: number; // 0 - 5, สามารถเป็นทศนิยม เช่น 4.5
  size?: number;
}

export const RatingStars = ({ rating, size = 16 }: RatingStarsProps) => {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (rating >= i + 1) {
      // เต็มดวง
      stars.push(<Icon key={i} name="star" size={size} color="#FFC107" />);
    } else if (rating >= i + 0.5) {
      // ครึ่งดวง
      stars.push(<Icon key={i} name="star-half-full" size={size} color="#FFC107" />);
    } else {
      // ว่าง
      stars.push(<Icon key={i} name="star-o" size={size} color="#E0E0E0" />);
    }
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap:4,
  },
});

