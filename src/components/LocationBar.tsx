import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Merchant } from '../types';
import { getCategoryDisplayName } from '../services/locationService';

interface LocationBarProps {
  merchant: Merchant | null;
  isDemo?: boolean;
}

export const LocationBar: React.FC<LocationBarProps> = ({
  merchant,
  isDemo = true,
}) => {
  if (!merchant) {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>?</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.merchantName}>No location detected</Text>
          <Text style={styles.category}>Tap to detect merchant</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, styles.activeIcon]}>
        <Text style={styles.icon}>*</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.merchantName}>{merchant.name}</Text>
        <Text style={styles.category}>
          {getCategoryDisplayName(merchant.category)}
          {isDemo && ' (Demo)'}
        </Text>
      </View>
      {merchant.address && (
        <Text style={styles.address} numberOfLines={1}>
          {merchant.address}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activeIcon: {
    backgroundColor: '#3B82F6',
  },
  icon: {
    fontSize: 18,
    color: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  merchantName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  address: {
    color: '#6B7280',
    fontSize: 12,
    marginLeft: 8,
    maxWidth: 100,
  },
});
