import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard } from '../components';
import { useCards } from '../context/CardContext';
import { trackApplyTapped } from '../services/analyticsService';
import { hapticTap } from '../services/hapticsService';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  MainTabs: undefined;
  Recommendation: undefined;
  CardDetail: { cardId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'CardDetail'>;

export const CardDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { getCardById } = useCards();
  const card = getCardById(route.params.cardId);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    hapticTap();
    const toValue = isFlipped ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  if (!card) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Card not found</Text>
      </SafeAreaView>
    );
  }

  const networkLabel = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
  }[card.network];

  const rewardTypeLabel = {
    cashback: 'Cash Back',
    points: 'Points',
    miles: 'Miles',
  }[card.rewardType];

  const cardWidth = width - 48;
  const cardHeight = cardWidth * 0.63;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Card Details</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Card with Flip */}
        <TouchableOpacity
          style={[styles.cardWrapper, { height: cardHeight }]}
          onPress={handleFlip}
          activeOpacity={0.9}
        >
          {/* Front */}
          <Animated.View
            style={[
              styles.flipCard,
              { transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }] },
            ]}
          >
            <CreditCard card={card} size="large" />
          </Animated.View>

          {/* Back */}
          <Animated.View
            style={[
              styles.flipCard,
              styles.flipCardBack,
              { transform: [{ perspective: 1000 }, { rotateY: backInterpolate }] },
            ]}
          >
            <LinearGradient
              colors={card.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.backFace, { width: cardWidth, height: cardHeight, borderRadius: 14 }]}
            >
              <Text style={styles.backTitle}>Reward Structure</Text>
              <View style={styles.backRewards}>
                <View style={styles.backRewardRow}>
                  <Text style={styles.backRewardMult}>{card.baseReward}x</Text>
                  <Text style={styles.backRewardLabel}>Everything Else</Text>
                </View>
                {card.rewardStructure.slice(0, 4).map((rs, i) => (
                  <View key={i} style={styles.backRewardRow}>
                    <Text style={styles.backRewardMult}>{rs.multiplier}x</Text>
                    <Text style={styles.backRewardLabel}>
                      {formatCategory(rs.category)}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.flipHint}>Tap to flip</Text>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Annual Fee</Text>
            <Text style={styles.statValue}>
              {card.annualFee === 0 ? 'Free' : `$${card.annualFee}`}
            </Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statLabel}>Reward Type</Text>
            <Text style={styles.statValue}>{rewardTypeLabel}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Network</Text>
            <Text style={styles.statValue}>{networkLabel}</Text>
          </View>
        </View>

        {/* Signup Bonus */}
        {card.signupBonus && (
          <View style={styles.bonusSection}>
            <Text style={styles.sectionTitle}>SIGNUP BONUS</Text>
            <View style={styles.bonusCard}>
              <Text style={styles.bonusText}>{card.signupBonus}</Text>
              {card.signupBonusValue != null && (
                <Text style={styles.bonusValue}>
                  ~${card.signupBonusValue} value
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Reward Structure */}
        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>REWARD STRUCTURE</Text>
          <View style={styles.rewardsTable}>
            {/* Base reward */}
            <View style={styles.rewardRow}>
              <View style={styles.rewardCategory}>
                <Text style={styles.rewardCategoryText}>Everything Else</Text>
              </View>
              <Text style={styles.rewardMultiplier}>{card.baseReward}x</Text>
              <Text style={styles.rewardDesc}>Base reward</Text>
            </View>
            {/* Category rewards */}
            {card.rewardStructure.map((rs, i) => (
              <View key={i} style={styles.rewardRow}>
                <View style={styles.rewardCategory}>
                  <Text style={styles.rewardCategoryText}>
                    {formatCategory(rs.category)}
                  </Text>
                </View>
                <Text style={styles.rewardMultiplier}>{rs.multiplier}x</Text>
                <Text style={styles.rewardDesc} numberOfLines={1}>
                  {rs.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            hapticTap();
            trackApplyTapped(card.id);
            const url = card.affiliateUrl || getDefaultApplyUrl(card);
            Linking.openURL(url);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

function getDefaultApplyUrl(card: { issuer: string; name: string }): string {
  const issuerUrls: Record<string, string> = {
    'American Express': 'https://www.americanexpress.com/us/credit-cards/',
    'Chase': 'https://creditcards.chase.com/',
    'Capital One': 'https://www.capitalone.com/credit-cards/',
    'Citi': 'https://www.citi.com/credit-cards/',
    'Discover': 'https://www.discover.com/credit-cards/',
    'Wells Fargo': 'https://www.wellsfargo.com/credit-cards/',
    'Bank of America': 'https://www.bankofamerica.com/credit-cards/',
    'U.S. Bank': 'https://www.usbank.com/credit-cards.html',
    'Apple': 'https://www.apple.com/apple-card/',
    'Bilt': 'https://www.bfrewarded.com/',
    'PayPal': 'https://www.paypal.com/us/digital-wallet/manage-money/paypal-cashback-mastercard',
    'Target': 'https://www.target.com/redcard',
    'Amazon': 'https://www.amazon.com/dp/BT00LN946S',
  };
  return issuerUrls[card.issuer] || 'https://www.google.com/search?q=' + encodeURIComponent(`${card.issuer} ${card.name} credit card apply`);
}

function formatCategory(cat: string): string {
  return cat
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
  },
  cardWrapper: {
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  flipCard: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    // back face is positioned absolutely on top
  },
  backFace: {
    padding: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 14,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  backRewards: {
    gap: 8,
  },
  backRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backRewardMult: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    width: 40,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  backRewardLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  flipHint: {
    color: '#4B5563',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  bonusSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  bonusCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  bonusText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  bonusValue: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  rewardsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  rewardsTable: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    overflow: 'hidden',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  rewardCategory: {
    width: 110,
  },
  rewardCategoryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  rewardMultiplier: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '800',
    width: 40,
    textAlign: 'center',
  },
  rewardDesc: {
    color: '#6B7280',
    fontSize: 12,
    flex: 1,
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    marginHorizontal: 16,
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
