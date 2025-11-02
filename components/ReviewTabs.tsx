import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const TAB_COUNT = 2;
const TAB_WIDTH = width / TAB_COUNT;

type ReviewTabOption = 'yourReviews' | 'receivedReviews';

const reviewOptions: { key: ReviewTabOption; label: string }[] = [
  { key: 'yourReviews', label: 'Your Reviews' },
  { key: 'receivedReviews', label: 'Received Reviews' },
];

interface ReviewTabsProps {
  selected: ReviewTabOption;
  setSelected: (val: ReviewTabOption) => void;
}

const ReviewTabs = ({ selected, setSelected }: ReviewTabsProps) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const index = reviewOptions.findIndex((opt) => opt.key === selected);
    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  }, [selected]);

  return (
    <View style={styles.container}>
      {reviewOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={styles.tab}
          onPress={() => setSelected(option.key)}
        >
          <Text
            style={[
              styles.tabText,
              selected === option.key && styles.tabTextSelected,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* ✅ เส้นใต้เคลื่อนตามแท็บที่เลือก */}
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

export default ReviewTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom:16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  tabTextSelected: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: TAB_WIDTH,
    height: 3,
    backgroundColor: Colors.primary,
  },
});

// import React from 'react';
// import AnimatedTabs from './AnimatedTabs';



// const ReviewTabs = ({
//   selectedTab,
//   setSelectedTab,
// }: {
//   selectedTab: 'yourReviews' | 'receivedReviews';
//   setSelectedTab: (tab: 'yourReviews' | 'receivedReviews') => void;
// }) => {
//   const options = [
//     { key: 'yourReviews', label: 'Your Reviews' },
//     { key: 'receivedReviews', label: 'Received Reviews' },
//   ] as const;

//   return (
//     <AnimatedTabs
//       options={options}
//       selected={selectedTab}
//       setSelected={setSelectedTab}
//     />
//   );
// };

// export default ReviewTabs;
