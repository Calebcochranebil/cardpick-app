// MCC (Merchant Category Code) categories
export type MCCCategory =
  | 'dining'
  | 'grocery'
  | 'gas'
  | 'travel'
  | 'drugstore'
  | 'entertainment'
  | 'streaming'
  | 'transit'
  | 'online_shopping'
  | 'other';

export interface RewardStructure {
  category: MCCCategory;
  multiplier: number;
  description: string;
  mccCodes?: string[];
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  network: 'visa' | 'mastercard' | 'amex' | 'discover';
  annualFee: number;
  baseReward: number;
  rewardType: 'points' | 'cashback' | 'miles';
  rewardStructure: RewardStructure[];
  color: string;
  gradientColors: [string, string];
  logoUrl?: string;
}

export interface Merchant {
  id: string;
  name: string;
  category: MCCCategory;
  mccCode: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface Recommendation {
  card: CreditCard;
  merchant: Merchant;
  multiplier: number;
  estimatedReward: string;
  reason: string;
}

export interface UserCard {
  cardId: string;
  addedAt: Date;
  nickname?: string;
}

export interface UserWallet {
  cards: UserCard[];
  defaultCardId?: string;
}
