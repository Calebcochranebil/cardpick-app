import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PointsBadgeProps {
  multiplier: number;
  rewardType: 'points' | 'cashback' | 'miles';
  category?: string;
  size?: 'small' | 'medium' | 'large';
}

export const PointsBadge: React.FC<PointsBadgeProps> = ({
  multiplier,
  rewardType,
  category,
  size = 'medium',
}) => {
  const getRewardLabel = () => {
    switch (rewardType) {
      case 'cashback':
        return `${multiplier}% back`;
      case 'miles':
        return `${multiplier}x miles`;
      case 'points':
      default:
        return `${multiplier}x points`;
    }
  };

  const getBadgeColor = () => {
    if (multiplier >= 5) return '#10B981'; // Green for excellent
    if (multiplier >= 3) return '#3B82F6'; // Blue for good
    if (multiplier >= 2) return '#8B5CF6'; // Purple for decent
    return '#6B7280'; // Gray for base
  };

  const fontSize = size === 'large' ? 28 : size === 'medium' ? 20 : 14;
  const padding = size === 'large' ? 16 : size === 'medium' ? 12 : 8;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBadgeColor(),
          paddingVertical: padding,
          paddingHorizontal: padding * 1.5,
        },
      ]}
    >
      <Text style={[styles.multiplierText, { fontSize }]}>{getRewardLabel()}</Text>
      {category && size !== 'small' && (
        <Text style={styles.categoryText}>on {category}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  multiplierText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  categoryText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
