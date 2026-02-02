import { CreditCard, Merchant, Recommendation, MCCCategory } from '../types';
import { CREDIT_CARDS, getCardById } from '../data/cards';

// MCC code to category mapping
const MCC_CATEGORY_MAP: Record<string, MCCCategory> = {
  // Dining
  '5812': 'dining',
  '5813': 'dining',
  '5814': 'dining',
  // Grocery
  '5411': 'grocery',
  '5422': 'grocery',
  // Gas
  '5541': 'gas',
  '5542': 'gas',
  // Drugstore
  '5912': 'drugstore',
  // Travel - Airlines
  '3000': 'travel',
  '3001': 'travel',
  '4511': 'travel',
  // Travel - Hotels
  '7011': 'travel',
  // Entertainment
  '7832': 'entertainment',
  '7922': 'entertainment',
  '7941': 'entertainment',
  // Transit
  '4111': 'transit',
  '4121': 'transit',
};

export const getCategoryFromMCC = (mccCode: string): MCCCategory => {
  return MCC_CATEGORY_MAP[mccCode] || 'other';
};

export const getMultiplierForCard = (
  card: CreditCard,
  category: MCCCategory
): number => {
  const matchingReward = card.rewardStructure.find(
    (reward) => reward.category === category
  );
  return matchingReward?.multiplier || card.baseReward;
};

export const getRewardDescription = (
  card: CreditCard,
  category: MCCCategory
): string => {
  const matchingReward = card.rewardStructure.find(
    (reward) => reward.category === category
  );
  return (
    matchingReward?.description ||
    `${card.baseReward}x ${card.rewardType} on all purchases`
  );
};

export const calculateEstimatedReward = (
  multiplier: number,
  rewardType: string,
  purchaseAmount: number = 100
): string => {
  const points = multiplier * purchaseAmount;
  if (rewardType === 'cashback') {
    return `$${(points / 100).toFixed(2)} cash back per $100`;
  }
  return `${points} ${rewardType} per $100 spent`;
};

export const getBestCard = (
  merchant: Merchant,
  userCardIds: string[]
): Recommendation | null => {
  const userCards = userCardIds
    .map((id) => getCardById(id))
    .filter((card): card is CreditCard => card !== undefined);

  if (userCards.length === 0) {
    return null;
  }

  let bestCard: CreditCard = userCards[0];
  let bestMultiplier = getMultiplierForCard(bestCard, merchant.category);

  for (const card of userCards) {
    const multiplier = getMultiplierForCard(card, merchant.category);
    if (multiplier > bestMultiplier) {
      bestMultiplier = multiplier;
      bestCard = card;
    }
  }

  return {
    card: bestCard,
    merchant,
    multiplier: bestMultiplier,
    estimatedReward: calculateEstimatedReward(
      bestMultiplier,
      bestCard.rewardType
    ),
    reason: getRewardDescription(bestCard, merchant.category),
  };
};

export const getAlternativeCards = (
  merchant: Merchant,
  userCardIds: string[],
  excludeCardId: string
): Recommendation[] => {
  const userCards = userCardIds
    .map((id) => getCardById(id))
    .filter(
      (card): card is CreditCard =>
        card !== undefined && card.id !== excludeCardId
    );

  return userCards
    .map((card) => {
      const multiplier = getMultiplierForCard(card, merchant.category);
      return {
        card,
        merchant,
        multiplier,
        estimatedReward: calculateEstimatedReward(multiplier, card.rewardType),
        reason: getRewardDescription(card, merchant.category),
      };
    })
    .sort((a, b) => b.multiplier - a.multiplier)
    .slice(0, 3);
};

export const getBestCardOverall = (
  merchant: Merchant,
  userCardIds: string[]
): Recommendation | null => {
  // Find the best card from ALL cards that the user does NOT own
  const nonOwnedCards = CREDIT_CARDS.filter(
    (card) => !userCardIds.includes(card.id)
  );

  if (nonOwnedCards.length === 0) return null;

  // Get user's best multiplier for comparison
  const userBest = getBestCard(merchant, userCardIds);
  const userBestMultiplier = userBest?.multiplier ?? 0;

  let bestCard: CreditCard | null = null;
  let bestMultiplier = 0;

  for (const card of nonOwnedCards) {
    const multiplier = getMultiplierForCard(card, merchant.category);
    if (multiplier > bestMultiplier) {
      bestMultiplier = multiplier;
      bestCard = card;
    }
  }

  // Only return if it beats the user's best card
  if (!bestCard || bestMultiplier <= userBestMultiplier) return null;

  return {
    card: bestCard,
    merchant,
    multiplier: bestMultiplier,
    estimatedReward: calculateEstimatedReward(bestMultiplier, bestCard.rewardType),
    reason: getRewardDescription(bestCard, merchant.category),
  };
};

export const getAllCardsRanked = (
  merchant: Merchant,
  userCardIds: string[]
): Recommendation[] => {
  const userCards = userCardIds
    .map((id) => getCardById(id))
    .filter((card): card is CreditCard => card !== undefined);

  return userCards
    .map((card) => {
      const multiplier = getMultiplierForCard(card, merchant.category);
      return {
        card,
        merchant,
        multiplier,
        estimatedReward: calculateEstimatedReward(multiplier, card.rewardType),
        reason: getRewardDescription(card, merchant.category),
      };
    })
    .sort((a, b) => b.multiplier - a.multiplier);
};
