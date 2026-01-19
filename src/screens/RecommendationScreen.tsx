import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreditCard, PointsBadge, AlternativeCards, MerchantPicker } from '../components';
import { Merchant, Recommendation } from '../types';
import {
  getBestCard,
  getAlternativeCards,
} from '../services/recommendationEngine';
import {
  detectNearbyMerchants,
  getNextDemoMerchant,
  getRandomMerchant,
  setDemoCategory,
  DEMO_CATEGORIES,
  getCategoryDisplayName,
} from '../services/locationService';
import { getUserCardIds } from '../services/userCardsService';
import { sendCardRecommendationNotification } from '../services/notificationService';

type RootStackParamList = {
  Home: undefined;
  Recommendation: undefined;
  MyCards: undefined;
};

type RecommendationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Recommendation'>;
};

export const RecommendationScreen: React.FC<RecommendationScreenProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(true);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [nearbyMerchants, setNearbyMerchants] = useState<Merchant[]>([]);
  const [isDemo, setIsDemo] = useState(true);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [alternatives, setAlternatives] = useState<Recommendation[]>([]);
  const [showMerchantPicker, setShowMerchantPicker] = useState(false);

  const loadRecommendation = useCallback(async (merchantToUse: Merchant, demoMode: boolean = true, showNotification: boolean = false) => {
    setMerchant(merchantToUse);
    setIsDemo(demoMode);

    const userCardIds = await getUserCardIds();

    if (userCardIds.length === 0) {
      setRecommendation(null);
      setAlternatives([]);
      return;
    }

    const bestCard = getBestCard(merchantToUse, userCardIds);
    setRecommendation(bestCard);

    if (bestCard) {
      const alts = getAlternativeCards(
        merchantToUse,
        userCardIds,
        bestCard.card.id
      );
      setAlternatives(alts);

      // Send notification when merchant is selected
      if (showNotification) {
        sendCardRecommendationNotification(merchantToUse, bestCard);
      }
    }
  }, []);

  const detectLocation = useCallback(async () => {
    setLoading(true);
    try {
      const result = await detectNearbyMerchants();
      setNearbyMerchants(result.merchants);
      setIsDemo(result.isDemo);

      if (result.merchants.length > 0) {
        await loadRecommendation(result.merchants[0], result.isDemo);
      }
    } catch (error) {
      console.error('Error detecting location:', error);
    } finally {
      setLoading(false);
    }
  }, [loadRecommendation]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const handleMerchantSelect = async (selectedMerchant: Merchant) => {
    await loadRecommendation(selectedMerchant, isDemo, true);
  };

  const handleOpenWallet = async () => {
    try {
      // iOS: shoebox:// opens Apple Wallet
      // Android: com.google.android.apps.walletnfcrel
      const walletUrl = Platform.OS === 'ios' ? 'shoebox://' : 'googlepay://';
      const canOpen = await Linking.canOpenURL(walletUrl);

      if (canOpen) {
        await Linking.openURL(walletUrl);
      } else {
        Alert.alert(
          'Wallet Not Available',
          Platform.OS === 'ios'
            ? 'Apple Wallet is not installed on this device.'
            : 'Google Pay is not installed on this device.'
        );
      }
    } catch (error) {
      console.error('Error opening wallet:', error);
    }
  };

  const handleNextMerchant = () => {
    const nextMerchant = getNextDemoMerchant();
    loadRecommendation(nextMerchant, true, true);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingPulse} />
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Finding nearby places...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recommendation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <View style={styles.emptyIconInner} />
          </View>
          <Text style={styles.emptyTitle}>No Cards Yet</Text>
          <Text style={styles.emptyText}>
            Add cards to your wallet to get personalized recommendations
          </Text>
          <TouchableOpacity
            style={styles.addCardsButton}
            onPress={() => navigation.navigate('MyCards')}
          >
            <Text style={styles.addCardsButtonText}>Add Cards</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Best Card</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Merchant Selection */}
        <TouchableOpacity
          style={styles.merchantBar}
          onPress={() => setShowMerchantPicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.merchantIcon}>
            <View style={styles.merchantIconDot} />
          </View>
          <View style={styles.merchantInfo}>
            <Text style={styles.merchantName}>{merchant?.name}</Text>
            <Text style={styles.merchantCategory}>
              {getCategoryDisplayName(merchant?.category || 'other')}
              {isDemo && ' (Demo)'}
            </Text>
          </View>
          <View style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </View>
        </TouchableOpacity>

        {!isDemo && nearbyMerchants.length > 1 && (
          <Text style={styles.wrongPlaceHint}>
            Wrong place? Tap above to select the correct merchant
          </Text>
        )}

        {/* Main Card Recommendation */}
        <View style={styles.cardSection}>
          <Text style={styles.useThisLabel}>USE THIS CARD</Text>

          <View style={styles.cardWrapper}>
            <View style={styles.cardGlow} />
            <CreditCard card={recommendation.card} size="large" />
          </View>

          <View style={styles.rewardBadge}>
            <PointsBadge
              multiplier={recommendation.multiplier}
              rewardType={recommendation.card.rewardType}
              category={getCategoryDisplayName(merchant?.category || 'other')}
              size="large"
            />
          </View>

          <Text style={styles.reasonText}>{recommendation.reason}</Text>
          <Text style={styles.estimatedText}>{recommendation.estimatedReward}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.walletButton}
            onPress={handleOpenWallet}
            activeOpacity={0.8}
          >
            <Text style={styles.walletButtonText}>Open Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Alternative Cards */}
        <AlternativeCards alternatives={alternatives} />

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={detectLocation}
          activeOpacity={0.7}
        >
          <Text style={styles.refreshButtonText}>Refresh Location</Text>
        </TouchableOpacity>

        {/* Demo Controls */}
        <View style={styles.demoControls}>
          <Text style={styles.demoTitle}>Demo Controls</Text>
          <Text style={styles.demoSubtitle}>Test different merchant types</Text>

          <View style={styles.categoryButtons}>
            {DEMO_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  merchant?.category === category && isDemo && styles.categoryButtonActive,
                ]}
                onPress={() => {
                  setDemoCategory(category);
                  const newMerchant = getRandomMerchant(category);
                  loadRecommendation(newMerchant, true, true);
                }}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    merchant?.category === category && isDemo && styles.categoryButtonTextActive,
                  ]}
                >
                  {getCategoryDisplayName(category)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextMerchant}
          >
            <Text style={styles.nextButtonText}>Next Merchant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Merchant Picker Modal */}
      <MerchantPicker
        visible={showMerchantPicker}
        merchants={nearbyMerchants}
        selectedMerchant={merchant}
        onSelect={handleMerchantSelect}
        onClose={() => setShowMerchantPicker(false)}
        isDemo={isDemo}
      />
    </SafeAreaView>
  );
};

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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingPulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIconInner: {
    width: 40,
    height: 28,
    borderWidth: 3,
    borderColor: '#333',
    borderRadius: 6,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  addCardsButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addCardsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  merchantBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252525',
  },
  merchantIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  merchantIconDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  merchantCategory: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 2,
  },
  changeButton: {
    backgroundColor: '#252525',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '600',
  },
  wrongPlaceHint: {
    color: '#F59E0B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 16,
  },
  cardSection: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  useThisLabel: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  cardGlow: {
    position: 'absolute',
    top: 20,
    width: '90%',
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    opacity: 0.15,
    transform: [{ scaleY: 0.8 }],
  },
  rewardBadge: {
    marginTop: 24,
  },
  reasonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  estimatedText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  walletButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  walletButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
  },
  refreshButton: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252525',
  },
  refreshButtonText: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '600',
  },
  demoControls: {
    marginTop: 32,
    paddingHorizontal: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  demoTitle: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  demoSubtitle: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#252525',
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#252525',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
