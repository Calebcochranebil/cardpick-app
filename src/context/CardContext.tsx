import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CreditCard } from '../types';
import { getCards, refreshCards } from '../services/cardService';
import { CREDIT_CARDS } from '../data/cards';

interface CardContextType {
  cards: CreditCard[];
  isLoading: boolean;
  lastUpdated: Date | null;
  refreshCardData: () => Promise<void>;
  getCardById: (id: string) => CreditCard | undefined;
  getCardsByIssuer: (issuer: string) => CreditCard[];
  searchCards: (query: string) => CreditCard[];
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<CreditCard[]>(CREDIT_CARDS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load cards on mount
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const fetchedCards = await getCards();
      setCards(fetchedCards);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading cards:', error);
      // Keep using local data on error
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedCards = await refreshCards();
      setCards(fetchedCards);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing cards:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCardById = useCallback((id: string): CreditCard | undefined => {
    return cards.find((card) => card.id === id);
  }, [cards]);

  const getCardsByIssuer = useCallback((issuer: string): CreditCard[] => {
    return cards.filter((card) => card.issuer === issuer);
  }, [cards]);

  const searchCards = useCallback((query: string): CreditCard[] => {
    const lowerQuery = query.toLowerCase();
    return cards.filter(
      (card) =>
        card.name.toLowerCase().includes(lowerQuery) ||
        card.issuer.toLowerCase().includes(lowerQuery)
    );
  }, [cards]);

  return (
    <CardContext.Provider
      value={{
        cards,
        isLoading,
        lastUpdated,
        refreshCardData,
        getCardById,
        getCardsByIssuer,
        searchCards,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export const useCards = (): CardContextType => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};

// Export for backward compatibility with existing code
export { CREDIT_CARDS } from '../data/cards';
