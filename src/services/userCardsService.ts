import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCard, UserWallet } from '../types';

const STORAGE_KEY = '@stax_wallet';

const DEFAULT_WALLET: UserWallet = {
  cards: [],
  defaultCardId: undefined,
};

// Default cards to add for new users
const DEFAULT_CARD_IDS = [
  'amex-gold',
  'chase-sapphire-preferred',
  'citi-double-cash',
  'chase-freedom-unlimited',
];

export const getWallet = async (): Promise<UserWallet> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const wallet = JSON.parse(stored);
      // Convert date strings back to Date objects
      wallet.cards = wallet.cards.map((card: UserCard) => ({
        ...card,
        addedAt: new Date(card.addedAt),
      }));
      return wallet;
    }
    // Initialize with default cards for demo
    const initialWallet = await initializeDefaultWallet();
    return initialWallet;
  } catch (error) {
    console.error('Error loading wallet:', error);
    return DEFAULT_WALLET;
  }
};

export const initializeDefaultWallet = async (): Promise<UserWallet> => {
  const defaultCards: UserCard[] = DEFAULT_CARD_IDS.map((cardId) => ({
    cardId,
    addedAt: new Date(),
  }));

  const wallet: UserWallet = {
    cards: defaultCards,
    defaultCardId: DEFAULT_CARD_IDS[0],
  };

  await saveWallet(wallet);
  return wallet;
};

export const saveWallet = async (wallet: UserWallet): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  } catch (error) {
    console.error('Error saving wallet:', error);
  }
};

export const getUserCardIds = async (): Promise<string[]> => {
  const wallet = await getWallet();
  return wallet.cards.map((card) => card.cardId);
};

export const addCard = async (cardId: string): Promise<boolean> => {
  try {
    const wallet = await getWallet();

    // Check if card already exists
    if (wallet.cards.some((card) => card.cardId === cardId)) {
      return false;
    }

    const newCard: UserCard = {
      cardId,
      addedAt: new Date(),
    };

    wallet.cards.push(newCard);

    // Set as default if it's the first card
    if (wallet.cards.length === 1) {
      wallet.defaultCardId = cardId;
    }

    await saveWallet(wallet);
    return true;
  } catch (error) {
    console.error('Error adding card:', error);
    return false;
  }
};

export const removeCard = async (cardId: string): Promise<boolean> => {
  try {
    const wallet = await getWallet();

    const index = wallet.cards.findIndex((card) => card.cardId === cardId);
    if (index === -1) {
      return false;
    }

    wallet.cards.splice(index, 1);

    // Update default if removed
    if (wallet.defaultCardId === cardId) {
      wallet.defaultCardId = wallet.cards[0]?.cardId;
    }

    await saveWallet(wallet);
    return true;
  } catch (error) {
    console.error('Error removing card:', error);
    return false;
  }
};

export const setDefaultCard = async (cardId: string): Promise<boolean> => {
  try {
    const wallet = await getWallet();

    // Check if card exists in wallet
    if (!wallet.cards.some((card) => card.cardId === cardId)) {
      return false;
    }

    wallet.defaultCardId = cardId;
    await saveWallet(wallet);
    return true;
  } catch (error) {
    console.error('Error setting default card:', error);
    return false;
  }
};

export const hasCard = async (cardId: string): Promise<boolean> => {
  const wallet = await getWallet();
  return wallet.cards.some((card) => card.cardId === cardId);
};

export const clearWallet = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing wallet:', error);
  }
};

export const resetToDefaults = async (): Promise<UserWallet> => {
  await clearWallet();
  return initializeDefaultWallet();
};
