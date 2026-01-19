import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { CreditCard, RewardStructure } from '../types';
import { CREDIT_CARDS } from '../data/cards';

const CARDS_CACHE_KEY = '@stax_cards_cache';
const CARDS_CACHE_TIMESTAMP_KEY = '@stax_cards_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Database row types (from Supabase)
interface CardRow {
  id: string;
  name: string;
  issuer: string;
  network: 'visa' | 'mastercard' | 'amex' | 'discover';
  annual_fee: number;
  base_reward: number;
  reward_type: 'points' | 'cashback' | 'miles';
  color: string;
  gradient_start: string;
  gradient_end: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  signup_bonus?: string;
  signup_bonus_value?: number;
  affiliate_url?: string;
}

interface RewardRow {
  id: string;
  card_id: string;
  category: string;
  multiplier: number;
  description: string;
  mcc_codes?: string[];
}

// Convert database rows to app format
const convertToAppFormat = (card: CardRow, rewards: RewardRow[]): CreditCard => {
  return {
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    network: card.network,
    annualFee: card.annual_fee,
    baseReward: card.base_reward,
    rewardType: card.reward_type,
    rewardStructure: rewards.map((r) => ({
      category: r.category as any,
      multiplier: r.multiplier,
      description: r.description,
      mccCodes: r.mcc_codes,
    })),
    color: card.color,
    gradientColors: [card.gradient_start, card.gradient_end],
    signupBonus: card.signup_bonus,
    signupBonusValue: card.signup_bonus_value,
    affiliateUrl: card.affiliate_url,
  };
};

// Fetch cards from Supabase
export const fetchCardsFromSupabase = async (): Promise<CreditCard[] | null> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, using local data');
    return null;
  }

  try {
    // Fetch all active cards
    const { data: cards, error: cardsError } = await supabase
      .from('cards')
      .select('*')
      .eq('is_active', true)
      .order('issuer', { ascending: true });

    if (cardsError) throw cardsError;
    if (!cards || cards.length === 0) return null;

    // Fetch all rewards
    const { data: rewards, error: rewardsError } = await supabase
      .from('card_rewards')
      .select('*');

    if (rewardsError) throw rewardsError;

    // Convert to app format
    const appCards = cards.map((card) => {
      const cardRewards = rewards?.filter((r) => r.card_id === card.id) || [];
      return convertToAppFormat(card, cardRewards);
    });

    // Cache the results
    await cacheCards(appCards);

    console.log(`Fetched ${appCards.length} cards from Supabase`);
    return appCards;
  } catch (error) {
    console.error('Error fetching cards from Supabase:', error);
    return null;
  }
};

// Cache cards locally
const cacheCards = async (cards: CreditCard[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CARDS_CACHE_KEY, JSON.stringify(cards));
    await AsyncStorage.setItem(CARDS_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error caching cards:', error);
  }
};

// Get cached cards
const getCachedCards = async (): Promise<CreditCard[] | null> => {
  try {
    const timestamp = await AsyncStorage.getItem(CARDS_CACHE_TIMESTAMP_KEY);
    if (!timestamp) return null;

    // Check if cache is still valid
    const cacheAge = Date.now() - parseInt(timestamp, 10);
    if (cacheAge > CACHE_DURATION) {
      console.log('Card cache expired');
      return null;
    }

    const cached = await AsyncStorage.getItem(CARDS_CACHE_KEY);
    if (!cached) return null;

    return JSON.parse(cached);
  } catch (error) {
    console.error('Error getting cached cards:', error);
    return null;
  }
};

// Main function to get cards (with fallback chain)
export const getCards = async (): Promise<CreditCard[]> => {
  // 1. Try to get from Supabase
  const remoteCards = await fetchCardsFromSupabase();
  if (remoteCards && remoteCards.length > 0) {
    return remoteCards;
  }

  // 2. Try to get from cache
  const cachedCards = await getCachedCards();
  if (cachedCards && cachedCards.length > 0) {
    console.log('Using cached cards');
    return cachedCards;
  }

  // 3. Fall back to local data
  console.log('Using local card data');
  return CREDIT_CARDS;
};

// Force refresh cards from Supabase
export const refreshCards = async (): Promise<CreditCard[]> => {
  const remoteCards = await fetchCardsFromSupabase();
  if (remoteCards && remoteCards.length > 0) {
    return remoteCards;
  }
  return CREDIT_CARDS;
};

// Clear card cache
export const clearCardCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CARDS_CACHE_KEY);
    await AsyncStorage.removeItem(CARDS_CACHE_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Error clearing card cache:', error);
  }
};
