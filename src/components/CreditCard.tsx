import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard as CreditCardType } from '../types';

interface CreditCardProps {
  card: CreditCardType;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

const { width } = Dimensions.get('window');

export const CreditCard: React.FC<CreditCardProps> = ({
  card,
  size = 'medium',
  showDetails = true,
}) => {
  const cardWidth =
    size === 'large' ? width - 48 : size === 'medium' ? width - 80 : 180;
  const cardHeight = cardWidth * 0.63; // Standard credit card ratio

  const getNetworkLogo = () => {
    switch (card.network) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'MC';
      case 'amex':
        return 'AMEX';
      case 'discover':
        return 'DISCOVER';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.cardContainer, { width: cardWidth, height: cardHeight }]}>
      <LinearGradient
        colors={card.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Shine overlay */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.25)',
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.shineOverlay}
        />

        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <View>
              <Text style={[styles.issuer, size === 'small' && styles.smallText]}>
                {card.issuer}
              </Text>
              <Text
                style={[styles.cardName, size === 'small' && styles.smallCardName]}
              >
                {card.name}
              </Text>
            </View>
            <Text style={[styles.network, size === 'small' && styles.smallText]}>
              {getNetworkLogo()}
            </Text>
          </View>

          {showDetails && size !== 'small' && (
            <View style={styles.chipContainer}>
              <View style={styles.chip}>
                <View style={styles.chipLine} />
                <View style={styles.chipLine} />
                <View style={styles.chipLine} />
              </View>
            </View>
          )}

          <View style={styles.bottomRow}>
            {showDetails && (
              <View>
                <Text style={styles.cardNumber}>**** **** **** ****</Text>
              </View>
            )}
            {card.annualFee > 0 && size !== 'small' && (
              <Text style={styles.annualFee}>${card.annualFee}/yr</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  issuer: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  smallCardName: {
    fontSize: 14,
  },
  smallText: {
    fontSize: 10,
  },
  network: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  chipContainer: {
    marginTop: 16,
  },
  chip: {
    width: 48,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 6,
    padding: 6,
    justifyContent: 'space-between',
  },
  chipLine: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: '500',
  },
  annualFee: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
  },
});
