import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Recommendation } from '../types';
import { CreditCard } from './CreditCard';
import { PointsBadge } from './PointsBadge';

interface AlternativeCardsProps {
  alternatives: Recommendation[];
  onCardPress?: (recommendation: Recommendation) => void;
}

export const AlternativeCards: React.FC<AlternativeCardsProps> = ({
  alternatives,
  onCardPress,
}) => {
  if (alternatives.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Other Options</Text>
      {alternatives.map((rec, index) => (
        <TouchableOpacity
          key={rec.card.id}
          style={styles.cardRow}
          onPress={() => onCardPress?.(rec)}
          activeOpacity={0.7}
        >
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{index + 2}</Text>
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardName}>
                  {rec.card.issuer} {rec.card.name}
                </Text>
                <Text style={styles.reason} numberOfLines={1}>
                  {rec.reason}
                </Text>
              </View>
              <PointsBadge
                multiplier={rec.multiplier}
                rewardType={rec.card.rewardType}
                size="small"
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  reason: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
    maxWidth: 200,
  },
});
