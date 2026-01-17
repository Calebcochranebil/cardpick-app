import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { CreditCard } from '../components';
import { CreditCard as CreditCardType } from '../types';
import { CREDIT_CARDS, getCardById } from '../data/cards';
import {
  getUserCardIds,
  addCard,
  removeCard,
  resetToDefaults,
} from '../services/userCardsService';

export const MyCardsScreen: React.FC = () => {
  const [userCardIds, setUserCardIds] = useState<string[]>([]);
  const [showAllCards, setShowAllCards] = useState(false);

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

  const availableCards = CREDIT_CARDS.filter(
    (card) => !userCardIds.includes(card.id)
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Wallet</Text>
          <Text style={styles.subtitle}>
            {userCards.length} card{userCards.length !== 1 ? 's' : ''} in wallet
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR CARDS</Text>
          {userCards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No cards in wallet</Text>
              <Text style={styles.emptySubtext}>
                Add cards below to get started
              </Text>
            </View>
          ) : (
            userCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.cardWrapper}
                onLongPress={() => handleRemoveCard(card.id)}
                activeOpacity={0.9}
              >
                <CreditCard card={card} size="medium" />
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveCard(card.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ADD CARDS</Text>
            <TouchableOpacity onPress={() => setShowAllCards(!showAllCards)}>
              <Text style={styles.toggleText}>
                {showAllCards ? 'Show Less' : 'Show All'}
              </Text>
            </TouchableOpacity>
          </View>

          {(showAllCards ? availableCards : availableCards.slice(0, 4)).map(
            (card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.addCardRow}
                onPress={() => handleAddCard(card.id)}
                activeOpacity={0.7}
              >
                <View style={styles.addCardInfo}>
                  <View
                    style={[
                      styles.cardColorDot,
                      { backgroundColor: card.gradientColors[0] },
                    ]}
                  />
                  <View>
                    <Text style={styles.addCardName}>
                      {card.issuer} {card.name}
                    </Text>
                    <Text style={styles.addCardDetails}>
                      {card.annualFee === 0
                        ? 'No annual fee'
                        : `$${card.annualFee}/year`}{' '}
                      {card.baseReward}x base {card.rewardType}
                    </Text>
                  </View>
                </View>
                <View style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset to Default Cards</Text>
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
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  toggleText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  cardWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  removeButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  removeButtonText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  addCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  addCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  addCardName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  addCardDetails: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  resetButton: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: '#1f1f1f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  resetButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
});
