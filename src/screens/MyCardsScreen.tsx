import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { CreditCard } from '../components';
import { CreditCard as CreditCardType } from '../types';
import { useCards } from '../context/CardContext';
import {
  getUserCardIds,
  addCard,
  removeCard,
  resetToDefaults,
} from '../services/userCardsService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

export const MyCardsScreen: React.FC = () => {
  const [userCardIds, setUserCardIds] = useState<string[]>([]);
  const [showAllCards, setShowAllCards] = useState(false);
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

  const handleAddCard = async (cardId: string) => {
    const success = await addCard(cardId);
    if (success) {
      await loadUserCards();
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    const card = getCardById(cardId);
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

  const userCards = userCardIds
    .map((id) => getCardById(id))
    .filter((card): card is CreditCardType => card !== undefined);

  const availableCards = cards.filter(
    (card) => !userCardIds.includes(card.id)
  );

  // Group available cards by issuer
  const groupedCards = availableCards.reduce((acc, card) => {
    if (!acc[card.issuer]) {
      acc[card.issuer] = [];
    }
    acc[card.issuer].push(card);
    return acc;
  }, {} as Record<string, CreditCardType[]>);

  const issuers = Object.keys(groupedCards).sort();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Wallet</Text>
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
                  <CreditCard card={card} size="small" />
                  <TouchableOpacity
                    style={styles.removeChip}
                    onPress={() => handleRemoveCard(card.id)}
                  >
                    <Text style={styles.removeChipText}>Remove</Text>
                  </TouchableOpacity>
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
                {showAllCards ? 'Less' : `All ${availableCards.length}`}
              </Text>
            </TouchableOpacity>
          </View>

          {showAllCards ? (
            // Grouped view by issuer
            issuers.map((issuer) => (
              <View key={issuer} style={styles.issuerGroup}>
                <Text style={styles.issuerName}>{issuer}</Text>
                {groupedCards[issuer].map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    style={styles.addCardRow}
                    onPress={() => handleAddCard(card.id)}
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
                        <Text style={styles.addCardName}>{card.name}</Text>
                        <Text style={styles.addCardDetails}>
                          {card.annualFee === 0 ? 'No AF' : `$${card.annualFee}/yr`}
                          {'  •  '}
                          {card.baseReward}x {card.rewardType}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.addButton}>
                      <Text style={styles.addButtonText}>+</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            // Simple list of first 6 cards
            availableCards.slice(0, 6).map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.addCardRow}
                onPress={() => handleAddCard(card.id)}
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
                      {card.issuer} {card.name}
                    </Text>
                    <Text style={styles.addCardDetails}>
                      {card.annualFee === 0 ? 'No AF' : `$${card.annualFee}/yr`}
                      {'  •  '}
                      {card.baseReward}x {card.rewardType}
                    </Text>
                  </View>
                </View>
                <View style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
      </ScrollView>
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
  removeChip: {
    marginTop: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  removeChipText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
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
