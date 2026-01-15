import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';


interface RatingBreakdownProps {
  reviews: { rating: number }[];
}

export const RatingBreakdown = ({ reviews }: RatingBreakdownProps) => {
  const total = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <View style={styles.container}>
      {ratingCounts.map(({ star, count }) => {
        const percentage = total === 0 ? 0 : (count / total) * 100;

        return (
          <View key={star} style={styles.row}>
            <ThemedText style={styles.starLabel}>⭐ {star}</ThemedText>
            <View style={styles.barContainer}>
              <View style={[styles.barFill, { width: `${percentage}%` }]} />
            </View>
            {/* <ThemedText style={styles.percentageThemedText}>{Math.round(percentage)}%</ThemedText> */}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    
    margin:8,
    
    
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starLabel: {
    width: 40,
    fontSize: 14,
  },
  barContainer: {
    
    flex: 1,
    height: 8,
    backgroundColor: '#bcbabaff',
    borderRadius: 5,
    // marginHorizontal: 8,
  },
  barFill: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
//   percentageThemedText: {
//     width: 30,
//     ThemedTextAlign: 'right',
//     fontSize: 12,
//     color: '#125238ff',
//   },
});
