import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreditCard, Confetti } from '../components';
import { CreditCard as CreditCardType } from '../types';
import { useCards } from '../context/CardContext';
import {
  getUserCardIds,
  addCard,
  removeCard,
  resetToDefaults,
} from '../services/userCardsService';
import { hapticSuccess, hapticWarning, hapticSelection } from '../services/hapticsService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

type RootStackParamList = {
  MainTabs: undefined;
  Recommendation: undefined;
  CardDetail: { cardId: string };
  Settings: undefined;
};

type FilterRewardType = 'cashback' | 'points' | 'miles';
type FilterNetwork = 'visa' | 'mastercard' | 'amex' | 'discover';
type FilterFee = 'no_fee' | 'under_100' | 'premium';

export const MyCardsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userCardIds, setUserCardIds] = useState<string[]>([]);
  const [showAllCards, setShowAllCards] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRewardTypes, setActiveRewardTypes] = useState<FilterRewardType[]>([]);
  const [activeNetworks, setActiveNetworks] = useState<FilterNetwork[]>([]);
  const [activeFees, setActiveFees] = useState<FilterFee[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { cards, getCardById } = useCards();

  const loadUserCards = useCallback(async () => {
    const cardIds = await getUserCardIds();
    setUserCardIds(cardIds);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserCards();
    }, [loadUserCards])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserCards();
    hapticSuccess();
    setRefreshing(false);
  }, [loadUserCards]);

  const handleAddCard = async (cardId: string) => {
    const success = await addCard(cardId);
    if (success) {
      hapticSuccess();
      await loadUserCards();
      setShowConfetti(true);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    const card = getCardById(cardId);
    hapticWarning();
    Alert.alert(
      'Remove Card',
      `Remove ${card?.issuer} ${card?.name} from your wallet?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await removeCard(cardId);
            if (success) {
              await loadUserCards();
            }
          },
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Wallet',
      'Reset to default cards? This will remove all your current cards.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetToDefaults();
            await loadUserCards();
          },
        },
      ]
    );
  };

  const toggleFilter = <T,>(list: T[], item: T, setter: (v: T[]) => void) => {
    hapticSelection();
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const userCards = userCardIds
    .map((id) => getCardById(id))
    .filter((card): card is CreditCardType => card !== undefined);

  const availableCards = cards.filter(
    (card) => !userCardIds.includes(card.id)
  );

  const filteredCards = useMemo(() => {
    let result = availableCards;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.issuer.toLowerCase().includes(q)
      );
    }

    if (activeRewardTypes.length > 0) {
      result = result.filter((c) => activeRewardTypes.includes(c.rewardType));
    }

    if (activeNetworks.length > 0) {
      result = result.filter((c) => activeNetworks.includes(c.network));
    }

    if (activeFees.length > 0) {
      result = result.filter((c) => {
        if (activeFees.includes('no_fee') && c.annualFee === 0) return true;
        if (activeFees.includes('under_100') && c.annualFee > 0 && c.annualFee < 100) return true;
        if (activeFees.includes('premium') && c.annualFee >= 100) return true;
        return false;
      });
    }

    return result;
  }, [availableCards, searchQuery, activeRewardTypes, activeNetworks, activeFees]);

  const hasActiveFilters = searchQuery.trim() || activeRewardTypes.length > 0 || activeNetworks.length > 0 || activeFees.length > 0;

  // Group filtered cards by issuer
  const groupedCards = filteredCards.reduce((acc, card) => {
    if (!acc[card.issuer]) {
      acc[card.issuer] = [];
    }
    acc[card.issuer].push(card);
    return acc;
  }, {} as Record<string, CreditCardType[]>);

  const issuers = Object.keys(groupedCards).sort();

  const renderCardRow = (card: CreditCardType, showIssuer: boolean = true) => (
    <TouchableOpacity
      key={card.id}
      style={styles.addCardRow}
      onPress={() => navigation.navigate('CardDetail', { cardId: card.id })}
      activeOpacity={0.7}
    >
      <View style={styles.addCardInfo}>
        <View
          style={[
            styles.cardColorBar,
            { backgroundColor: card.gradientColors[0] },
          ]}
        />
        <View style={styles.cardTextInfo}>
          <Text style={styles.addCardName}>
            {showIssuer ? `${card.issuer} ` : ''}{card.name}
          </Text>
          <Text style={styles.addCardDetails}>
            {card.annualFee === 0 ? 'No AF' : `$${card.annualFee}/yr`}
            {'  •  '}
            {card.baseReward}x {card.rewardType}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddCard(card.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>My Wallet</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.settingsIcon}>{'⚙'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            {userCards.length} card{userCards.length !== 1 ? 's' : ''} added
          </Text>
        </View>

        {/* User's Cards - Horizontal Scroll */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR CARDS</Text>
          {userCards.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>+</Text>
              </View>
              <Text style={styles.emptyText}>No cards yet</Text>
              <Text style={styles.emptySubtext}>
                Add your credit cards below
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsScrollContent}
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH + 12}
            >
              {userCards.map((card) => (
                <View key={card.id} style={styles.cardItem}>
                  <CreditCard
                    card={card}
                    size="small"
                    onPress={() => navigation.navigate('CardDetail', { cardId: card.id })}
                    onLongPress={() => handleRemoveCard(card.id)}
                  />
                  <Text style={styles.longPressHint}>Hold to remove</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Add Cards Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ADD CARDS</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowAllCards(!showAllCards)}
            >
              <Text style={styles.toggleText}>
                {showAllCards ? 'Less' : `All ${filteredCards.length}`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>S</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search cards..."
              placeholderTextColor="#555"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearText}>x</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {/* Reward type */}
            {(['cashback', 'points', 'miles'] as FilterRewardType[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.filterChip, activeRewardTypes.includes(t) && styles.filterChipActive]}
                onPress={() => toggleFilter(activeRewardTypes, t, setActiveRewardTypes)}
              >
                <Text style={[styles.filterChipText, activeRewardTypes.includes(t) && styles.filterChipTextActive]}>
                  {t === 'cashback' ? 'Cash Back' : t === 'points' ? 'Points' : 'Miles'}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.filterDivider} />
            {/* Network */}
            {(['visa', 'mastercard', 'amex', 'discover'] as FilterNetwork[]).map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.filterChip, activeNetworks.includes(n) && styles.filterChipActive]}
                onPress={() => toggleFilter(activeNetworks, n, setActiveNetworks)}
              >
                <Text style={[styles.filterChipText, activeNetworks.includes(n) && styles.filterChipTextActive]}>
                  {n === 'mastercard' ? 'MC' : n === 'amex' ? 'Amex' : n.charAt(0).toUpperCase() + n.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.filterDivider} />
            {/* Fee */}
            {([['no_fee', 'No Fee'], ['under_100', 'Under $100'], ['premium', '$100+']] as [FilterFee, string][]).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.filterChip, activeFees.includes(key) && styles.filterChipActive]}
                onPress={() => toggleFilter(activeFees, key, setActiveFees)}
              >
                <Text style={[styles.filterChipText, activeFees.includes(key) && styles.filterChipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredCards.length === 0 && hasActiveFilters ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No cards match your filters</Text>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setActiveRewardTypes([]);
                  setActiveNetworks([]);
                  setActiveFees([]);
                }}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          ) : showAllCards ? (
            issuers.map((issuer) => (
              <View key={issuer} style={styles.issuerGroup}>
                <Text style={styles.issuerName}>{issuer}</Text>
                {groupedCards[issuer].map((card) => renderCardRow(card, false))}
              </View>
            ))
          ) : (
            filteredCards.slice(0, 6).map((card) => renderCardRow(card, true))
          )}
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
      </ScrollView>

      <Confetti visible={showConfetti} onComplete={() => setShowConfetti(false)} />
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
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
    color: '#6B7280',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  toggleButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  toggleText: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderStyle: 'dashed',
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    color: '#3B82F6',
    fontSize: 28,
    fontWeight: '300',
  },
  emptyText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  cardsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  cardItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  longPressHint: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 8,
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  searchIcon: {
    color: '#555',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    padding: 0,
  },
  clearText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
    paddingLeft: 8,
  },
  // Filters
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252525',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  filterDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#252525',
    alignSelf: 'center',
  },
  // No results
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noResultsText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '500',
  },
  clearFiltersText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  // Card rows
  issuerGroup: {
    marginBottom: 20,
  },
  issuerName: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  addCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  addCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardColorBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: 14,
  },
  cardTextInfo: {
    flex: 1,
  },
  addCardName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  addCardDetails: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 3,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '500',
    marginTop: -2,
  },
  resetButton: {
    marginTop: 32,
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  resetButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});
