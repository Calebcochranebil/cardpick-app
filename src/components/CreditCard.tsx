import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard as CreditCardType } from '../types';

interface CreditCardProps {
  card: CreditCardType;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  onLongPress?: () => void;
}

const { width } = Dimensions.get('window');

export const CreditCard: React.FC<CreditCardProps> = ({
  card,
  size = 'medium',
  onPress,
  onLongPress,
}) => {
  const cardWidth =
    size === 'large' ? width - 48 : size === 'medium' ? width - 80 : 160;
  const cardHeight = cardWidth * 0.63;

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const renderNetworkLogo = () => {
    switch (card.network) {
      case 'visa':
        return (
          <View style={styles.visaContainer}>
            <Text style={[styles.visaText, isSmall && styles.visaTextSmall]}>
              VISA
            </Text>
          </View>
        );
      case 'mastercard':
        return (
          <View style={styles.mastercardContainer}>
            <View style={[styles.mcCircle, styles.mcRed, isSmall && styles.mcCircleSmall]} />
            <View style={[styles.mcCircle, styles.mcOrange, styles.mcOverlap, isSmall && styles.mcCircleSmall]} />
          </View>
        );
      case 'amex':
        return (
          <View style={[styles.amexContainer, isSmall && styles.amexContainerSmall]}>
            <Text style={[styles.amexText, isSmall && styles.amexTextSmall]}>
              AMEX
            </Text>
          </View>
        );
      case 'discover':
        return (
          <View style={styles.discoverContainer}>
            <Text style={[styles.discoverText, isSmall && styles.discoverTextSmall]}>
              DISCOVER
            </Text>
            <View style={[styles.discoverDot, isSmall && styles.discoverDotSmall]} />
          </View>
        );
      default:
        return null;
    }
  };

  const renderChip = () => {
    if (isSmall) return null;

    // Amex has chip on right side and centered
    if (card.network === 'amex') {
      return (
        <View style={styles.amexChipContainer}>
          <View style={[styles.chip, styles.amexChip]}>
            <View style={styles.chipInner}>
              <View style={styles.chipContactArea} />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.chipContainer}>
        <View style={styles.chip}>
          <View style={styles.chipInner}>
            <View style={styles.chipContactArea} />
          </View>
        </View>
      </View>
    );
  };

  const Wrapper = (onPress || onLongPress) ? TouchableOpacity : View;
  const wrapperProps = (onPress || onLongPress) ? { onPress, onLongPress, activeOpacity: 0.85 } : {};

  return (
    <Wrapper {...wrapperProps} style={[styles.cardContainer, { width: cardWidth, height: cardHeight }]}>
      <LinearGradient
        colors={card.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Subtle pattern overlay for texture */}
        <View style={styles.patternOverlay} />

        {/* Shine effect */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.15)',
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={styles.shineOverlay}
        />

        <View style={styles.cardContent}>
          {/* Top section - Issuer and Network */}
          <View style={styles.topRow}>
            <View style={styles.issuerContainer}>
              <Text style={[
                styles.issuer,
                isSmall && styles.issuerSmall,
                card.network === 'amex' && styles.issuerAmex
              ]}>
                {card.issuer}
              </Text>
            </View>
            {renderNetworkLogo()}
          </View>

          {/* Middle section - Chip */}
          {renderChip()}

          {/* Bottom section - Card Name */}
          <View style={styles.bottomSection}>
            <Text style={[
              styles.cardName,
              isSmall && styles.cardNameSmall,
              isLarge && styles.cardNameLarge
            ]} numberOfLines={1}>
              {card.name}
            </Text>
            {!isSmall && card.annualFee > 0 && (
              <Text style={styles.annualFee}>
                ${card.annualFee}/year
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: '#fff',
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  issuerContainer: {
    flex: 1,
  },
  issuer: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  issuerSmall: {
    fontSize: 11,
  },
  issuerAmex: {
    color: '#fff',
  },
  // Visa styles
  visaContainer: {
    justifyContent: 'center',
  },
  visaText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  visaTextSmall: {
    fontSize: 14,
  },
  // Mastercard styles
  mastercardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  mcCircleSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  mcRed: {
    backgroundColor: '#EB001B',
  },
  mcOrange: {
    backgroundColor: '#F79E1B',
  },
  mcOverlap: {
    marginLeft: -10,
    opacity: 0.9,
  },
  // Amex styles
  amexContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amexContainerSmall: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  amexText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  amexTextSmall: {
    fontSize: 8,
    letterSpacing: 1,
  },
  // Discover styles
  discoverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discoverText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  discoverTextSmall: {
    fontSize: 8,
  },
  discoverDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6600',
    marginLeft: 4,
  },
  discoverDotSmall: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 2,
  },
  // Chip styles
  chipContainer: {
    marginTop: 12,
  },
  amexChipContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  chip: {
    width: 42,
    height: 32,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  amexChip: {
    width: 38,
    height: 28,
  },
  chipInner: {
    flex: 1,
    padding: 4,
    justifyContent: 'center',
  },
  chipContactArea: {
    flex: 1,
    backgroundColor: 'rgba(180,150,50,0.6)',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(120,100,30,0.4)',
  },
  // Bottom section
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardNameSmall: {
    fontSize: 12,
  },
  cardNameLarge: {
    fontSize: 18,
  },
  annualFee: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 8,
  },
});
