import React from 'react';
import AnimatedTabs from './AnimatedTabs';

const SortTabs = ({
  sortOption,
  setSortOption,
}: {
  sortOption: 'latest' | 'oldest' | 'highest' | 'lowest';
  setSortOption: (option: 'latest' | 'oldest' | 'highest' | 'lowest') => void;
}) => {
  const options = [
    { key: 'latest', label: 'ล่าสุด' },
    { key: 'oldest', label: 'เก่าสุด' },
    { key: 'highest', label: 'เรตติ้งมาก' },
    { key: 'lowest', label: 'เรตติ้งน้อย' },
  ] as const;

  return (
    <AnimatedTabs
      options={options}
      selected={sortOption}
      setSelected={setSortOption}
    />
  );
};

export default SortTabs;
