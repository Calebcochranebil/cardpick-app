import { CreditCard } from '../types';

export const CREDIT_CARDS: CreditCard[] = [
  // ============================================
  // AMERICAN EXPRESS
  // ============================================
  {
    id: 'amex-gold',
    name: 'Gold Card',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 250,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'dining', multiplier: 4, description: '4x points at restaurants worldwide' },
      { category: 'grocery', multiplier: 4, description: '4x points at U.S. supermarkets (up to $25k/year)' },
    ],
    color: '#B8860B',
    gradientColors: ['#D4AF37', '#996515'],
  },
  {
    id: 'amex-platinum',
    name: 'Platinum Card',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 695,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 5, description: '5x on flights booked directly with airlines' },
      { category: 'travel', multiplier: 5, description: '5x on prepaid hotels via Amex Travel' },
    ],
    color: '#E5E4E2',
    gradientColors: ['#A8A9AD', '#71797E'],
  },
  {
    id: 'amex-blue-cash-preferred',
    name: 'Blue Cash Preferred',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 95,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'grocery', multiplier: 6, description: '6% at U.S. supermarkets (up to $6k/year)' },
      { category: 'streaming', multiplier: 6, description: '6% on select streaming subscriptions' },
      { category: 'transit', multiplier: 3, description: '3% on transit including rideshare' },
      { category: 'gas', multiplier: 3, description: '3% at U.S. gas stations' },
    ],
    color: '#006FCF',
    gradientColors: ['#006FCF', '#00175A'],
  },
  {
    id: 'amex-blue-cash-everyday',
    name: 'Blue Cash Everyday',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'grocery', multiplier: 3, description: '3% at U.S. supermarkets (up to $6k/year)' },
      { category: 'gas', multiplier: 3, description: '3% at U.S. gas stations (up to $6k/year)' },
      { category: 'online_shopping', multiplier: 3, description: '3% on U.S. online retail purchases (up to $6k/year)' },
    ],
    color: '#006FCF',
    gradientColors: ['#00A1E4', '#006FCF'],
  },
  {
    id: 'amex-green',
    name: 'Green Card',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 150,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 3, description: '3x on travel' },
      { category: 'transit', multiplier: 3, description: '3x on transit' },
      { category: 'dining', multiplier: 3, description: '3x on dining' },
    ],
    color: '#2E8B57',
    gradientColors: ['#3CB371', '#2E8B57'],
  },

  // ============================================
  // CHASE
  // ============================================
  {
    id: 'chase-sapphire-preferred',
    name: 'Sapphire Preferred',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'dining', multiplier: 3, description: '3x on dining' },
      { category: 'streaming', multiplier: 3, description: '3x on streaming services' },
      { category: 'online_shopping', multiplier: 3, description: '3x on online grocery' },
      { category: 'travel', multiplier: 2, description: '2x on travel' },
    ],
    color: '#0A1172',
    gradientColors: ['#1E3A8A', '#0A1172'],
  },
  {
    id: 'chase-sapphire-reserve',
    name: 'Sapphire Reserve',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 550,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'dining', multiplier: 3, description: '3x on dining' },
      { category: 'travel', multiplier: 3, description: '3x on travel' },
      { category: 'streaming', multiplier: 3, description: '3x on streaming' },
    ],
    color: '#1C1C1C',
    gradientColors: ['#2D2D2D', '#0D0D0D'],
  },
  {
    id: 'chase-freedom-unlimited',
    name: 'Freedom Unlimited',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    baseReward: 1.5,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'dining', multiplier: 3, description: '3% on dining' },
      { category: 'drugstore', multiplier: 3, description: '3% on drugstores' },
      { category: 'travel', multiplier: 5, description: '5% on travel via Chase' },
    ],
    color: '#00A3E0',
    gradientColors: ['#00A3E0', '#0077B5'],
  },
  {
    id: 'chase-freedom-flex',
    name: 'Freedom Flex',
    issuer: 'Chase',
    network: 'mastercard',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'dining', multiplier: 3, description: '3% on dining' },
      { category: 'drugstore', multiplier: 3, description: '3% on drugstores' },
      { category: 'other', multiplier: 5, description: '5% on rotating quarterly categories' },
    ],
    color: '#00A3E0',
    gradientColors: ['#00C6FF', '#0072FF'],
  },
  {
    id: 'chase-ink-preferred',
    name: 'Ink Business Preferred',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 3, description: '3x on travel' },
      { category: 'shipping', multiplier: 3, description: '3x on shipping' },
      { category: 'online_shopping', multiplier: 3, description: '3x on internet, cable, phone' },
      { category: 'other', multiplier: 3, description: '3x on advertising purchases' },
    ],
    color: '#1C1C1C',
    gradientColors: ['#333333', '#1C1C1C'],
  },
  {
    id: 'chase-ink-cash',
    name: 'Ink Business Cash',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'office', multiplier: 5, description: '5% at office supply stores' },
      { category: 'online_shopping', multiplier: 5, description: '5% on internet, cable, phone (up to $25k/year)' },
      { category: 'gas', multiplier: 2, description: '2% at gas stations (up to $25k/year)' },
      { category: 'dining', multiplier: 2, description: '2% at restaurants (up to $25k/year)' },
    ],
    color: '#00A3E0',
    gradientColors: ['#00A3E0', '#005f8a'],
  },
  {
    id: 'chase-amazon-prime',
    name: 'Amazon Prime Rewards',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'online_shopping', multiplier: 5, description: '5% at Amazon & Whole Foods' },
      { category: 'dining', multiplier: 2, description: '2% at restaurants' },
      { category: 'gas', multiplier: 2, description: '2% at gas stations' },
      { category: 'drugstore', multiplier: 2, description: '2% at drugstores' },
    ],
    color: '#FF9900',
    gradientColors: ['#FF9900', '#146EB4'],
  },

  // ============================================
  // CAPITAL ONE
  // ============================================
  {
    id: 'capital-one-venture-x',
    name: 'Venture X',
    issuer: 'Capital One',
    network: 'visa',
    annualFee: 395,
    baseReward: 2,
    rewardType: 'miles',
    rewardStructure: [
      { category: 'travel', multiplier: 10, description: '10x on hotels & rentals via Capital One Travel' },
      { category: 'travel', multiplier: 5, description: '5x on flights via Capital One Travel' },
    ],
    color: '#1A1A1A',
    gradientColors: ['#2D2D2D', '#0D0D0D'],
  },
  {
    id: 'capital-one-venture',
    name: 'Venture',
    issuer: 'Capital One',
    network: 'visa',
    annualFee: 95,
    baseReward: 2,
    rewardType: 'miles',
    rewardStructure: [
      { category: 'travel', multiplier: 5, description: '5x on hotels/rentals via Capital One Travel' },
    ],
    color: '#D03027',
    gradientColors: ['#D03027', '#8B1A1A'],
  },
  {
    id: 'capital-one-savor-one',
    name: 'SavorOne',
    issuer: 'Capital One',
    network: 'mastercard',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'dining', multiplier: 3, description: '3% on dining' },
      { category: 'entertainment', multiplier: 3, description: '3% on entertainment' },
      { category: 'grocery', multiplier: 3, description: '3% at grocery stores' },
      { category: 'streaming', multiplier: 3, description: '3% on streaming services' },
    ],
    color: '#004977',
    gradientColors: ['#0066A1', '#003366'],
  },
  {
    id: 'capital-one-savor',
    name: 'Savor',
    issuer: 'Capital One',
    network: 'mastercard',
    annualFee: 95,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'dining', multiplier: 4, description: '4% on dining' },
      { category: 'entertainment', multiplier: 4, description: '4% on entertainment' },
      { category: 'grocery', multiplier: 3, description: '3% at grocery stores' },
      { category: 'streaming', multiplier: 3, description: '3% on streaming services' },
    ],
    color: '#004977',
    gradientColors: ['#003366', '#001a33'],
  },
  {
    id: 'capital-one-quicksilver',
    name: 'Quicksilver',
    issuer: 'Capital One',
    network: 'mastercard',
    annualFee: 0,
    baseReward: 1.5,
    rewardType: 'cashback',
    rewardStructure: [],
    color: '#A9A9A9',
    gradientColors: ['#C0C0C0', '#808080'],
  },

  // ============================================
  // CITI
  // ============================================
  {
    id: 'citi-double-cash',
    name: 'Double Cash',
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 0,
    baseReward: 2,
    rewardType: 'cashback',
    rewardStructure: [],
    color: '#003B70',
    gradientColors: ['#004C8C', '#002855'],
  },
  {
    id: 'citi-custom-cash',
    name: 'Custom Cash',
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'grocery', multiplier: 5, description: '5% on top category (up to $500/month)' },
      { category: 'gas', multiplier: 5, description: '5% on top category (up to $500/month)' },
      { category: 'dining', multiplier: 5, description: '5% on top category (up to $500/month)' },
      { category: 'drugstore', multiplier: 5, description: '5% on top category (up to $500/month)' },
      { category: 'travel', multiplier: 5, description: '5% on top category (up to $500/month)' },
    ],
    color: '#E31837',
    gradientColors: ['#E31837', '#8B0000'],
  },
  {
    id: 'citi-premier',
    name: 'Premier',
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 95,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 3, description: '3x on air travel and hotels' },
      { category: 'dining', multiplier: 3, description: '3x at restaurants' },
      { category: 'grocery', multiplier: 3, description: '3x at supermarkets' },
      { category: 'gas', multiplier: 3, description: '3x at gas stations' },
    ],
    color: '#003B70',
    gradientColors: ['#0056b3', '#003B70'],
  },

  // ============================================
  // DISCOVER
  // ============================================
  {
    id: 'discover-it',
    name: 'Discover it',
    issuer: 'Discover',
    network: 'discover',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'other', multiplier: 5, description: '5% on rotating quarterly categories (up to $1500)' },
    ],
    color: '#FF6600',
    gradientColors: ['#FF6600', '#CC5200'],
  },
  {
    id: 'discover-it-miles',
    name: 'Discover it Miles',
    issuer: 'Discover',
    network: 'discover',
    annualFee: 0,
    baseReward: 1.5,
    rewardType: 'miles',
    rewardStructure: [],
    color: '#FF6600',
    gradientColors: ['#FF8533', '#FF6600'],
  },

  // ============================================
  // WELLS FARGO
  // ============================================
  {
    id: 'wells-fargo-active-cash',
    name: 'Active Cash',
    issuer: 'Wells Fargo',
    network: 'visa',
    annualFee: 0,
    baseReward: 2,
    rewardType: 'cashback',
    rewardStructure: [],
    color: '#D71E28',
    gradientColors: ['#D71E28', '#8B0000'],
  },
  {
    id: 'wells-fargo-autograph',
    name: 'Autograph',
    issuer: 'Wells Fargo',
    network: 'visa',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'dining', multiplier: 3, description: '3x on dining' },
      { category: 'travel', multiplier: 3, description: '3x on travel' },
      { category: 'gas', multiplier: 3, description: '3x on gas' },
      { category: 'transit', multiplier: 3, description: '3x on transit' },
      { category: 'streaming', multiplier: 3, description: '3x on streaming' },
      { category: 'entertainment', multiplier: 3, description: '3x on entertainment' },
    ],
    color: '#D71E28',
    gradientColors: ['#FF4136', '#D71E28'],
  },

  // ============================================
  // BANK OF AMERICA
  // ============================================
  {
    id: 'bofa-customized-cash',
    name: 'Customized Cash Rewards',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'gas', multiplier: 3, description: '3% in category of choice' },
      { category: 'online_shopping', multiplier: 2, description: '2% at grocery/wholesale clubs' },
    ],
    color: '#012169',
    gradientColors: ['#012169', '#001030'],
  },
  {
    id: 'bofa-premium-rewards',
    name: 'Premium Rewards',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 95,
    baseReward: 1.5,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 2, description: '2x on travel and dining' },
      { category: 'dining', multiplier: 2, description: '2x on travel and dining' },
    ],
    color: '#012169',
    gradientColors: ['#1a3a7a', '#012169'],
  },
  {
    id: 'bofa-unlimited-cash',
    name: 'Unlimited Cash Rewards',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 0,
    baseReward: 1.5,
    rewardType: 'cashback',
    rewardStructure: [],
    color: '#012169',
    gradientColors: ['#3366CC', '#012169'],
  },

  // ============================================
  // US BANK
  // ============================================
  {
    id: 'usbank-altitude-go',
    name: 'Altitude Go',
    issuer: 'U.S. Bank',
    network: 'visa',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'dining', multiplier: 4, description: '4x on dining' },
      { category: 'grocery', multiplier: 2, description: '2x at grocery stores' },
      { category: 'gas', multiplier: 2, description: '2x at gas stations' },
      { category: 'streaming', multiplier: 2, description: '2x on streaming' },
    ],
    color: '#0C2074',
    gradientColors: ['#1e3a8a', '#0C2074'],
  },
  {
    id: 'usbank-altitude-reserve',
    name: 'Altitude Reserve',
    issuer: 'U.S. Bank',
    network: 'visa',
    annualFee: 400,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 3, description: '3x on travel and mobile wallet purchases' },
      { category: 'dining', multiplier: 3, description: '3x on dining' },
    ],
    color: '#0C2074',
    gradientColors: ['#0C2074', '#050d30'],
  },
  {
    id: 'usbank-cash-plus',
    name: 'Cash+',
    issuer: 'U.S. Bank',
    network: 'visa',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'other', multiplier: 5, description: '5% on 2 categories you choose (up to $2k/quarter)' },
      { category: 'gas', multiplier: 2, description: '2% at gas stations and restaurants' },
      { category: 'dining', multiplier: 2, description: '2% at gas stations and restaurants' },
    ],
    color: '#0C2074',
    gradientColors: ['#4169E1', '#0C2074'],
  },

  // ============================================
  // APPLE
  // ============================================
  {
    id: 'apple-card',
    name: 'Apple Card',
    issuer: 'Apple',
    network: 'mastercard',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'online_shopping', multiplier: 3, description: '3% at Apple and select merchants' },
      { category: 'other', multiplier: 2, description: '2% when using Apple Pay' },
    ],
    color: '#F5F5F7',
    gradientColors: ['#FFFFFF', '#E5E5E7'],
  },

  // ============================================
  // COSTCO
  // ============================================
  {
    id: 'costco-anywhere',
    name: 'Costco Anywhere',
    issuer: 'Citi',
    network: 'visa',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'gas', multiplier: 4, description: '4% on gas (up to $7k/year)' },
      { category: 'travel', multiplier: 3, description: '3% on travel and restaurants' },
      { category: 'dining', multiplier: 3, description: '3% on travel and restaurants' },
      { category: 'grocery', multiplier: 2, description: '2% at Costco' },
    ],
    color: '#E31837',
    gradientColors: ['#E31837', '#005DAA'],
  },

  // ============================================
  // TARGET
  // ============================================
  {
    id: 'target-redcard',
    name: 'RedCard',
    issuer: 'Target',
    network: 'visa',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'other', multiplier: 5, description: '5% off at Target' },
    ],
    color: '#CC0000',
    gradientColors: ['#CC0000', '#990000'],
  },

  // ============================================
  // AMAZON (STORE CARD)
  // ============================================
  {
    id: 'amazon-store-card',
    name: 'Store Card',
    issuer: 'Amazon',
    network: 'visa',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'online_shopping', multiplier: 5, description: '5% back at Amazon (Prime members)' },
    ],
    color: '#FF9900',
    gradientColors: ['#FF9900', '#E88B00'],
  },

  // ============================================
  // PAYPAL
  // ============================================
  {
    id: 'paypal-cashback',
    name: 'Cashback Mastercard',
    issuer: 'PayPal',
    network: 'mastercard',
    annualFee: 0,
    baseReward: 2,
    rewardType: 'cashback',
    rewardStructure: [
      { category: 'other', multiplier: 3, description: '3% when using PayPal' },
    ],
    color: '#003087',
    gradientColors: ['#003087', '#001F5C'],
  },

  // ============================================
  // BILT
  // ============================================
  {
    id: 'bilt-mastercard',
    name: 'Bilt Mastercard',
    issuer: 'Bilt',
    network: 'mastercard',
    annualFee: 0,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'dining', multiplier: 3, description: '3x on dining' },
      { category: 'travel', multiplier: 2, description: '2x on travel' },
      { category: 'other', multiplier: 1, description: '1x on rent (no fees)' },
    ],
    color: '#000000',
    gradientColors: ['#333333', '#000000'],
  },

  // ============================================
  // VENTURE CARDS FOR SPECIFIC TRAVEL
  // ============================================
  {
    id: 'hilton-honors-amex',
    name: 'Hilton Honors',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 0,
    baseReward: 3,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 7, description: '7x at Hilton hotels' },
      { category: 'dining', multiplier: 5, description: '5x at restaurants' },
      { category: 'grocery', multiplier: 5, description: '5x at U.S. supermarkets' },
      { category: 'gas', multiplier: 5, description: '5x at U.S. gas stations' },
    ],
    color: '#104C97',
    gradientColors: ['#104C97', '#0A2F5C'],
  },
  {
    id: 'marriott-bonvoy-boundless',
    name: 'Marriott Bonvoy Boundless',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    baseReward: 2,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 6, description: '6x at Marriott hotels' },
      { category: 'grocery', multiplier: 2, description: '2x at grocery stores' },
      { category: 'gas', multiplier: 2, description: '2x at gas stations' },
      { category: 'dining', multiplier: 2, description: '2x at restaurants' },
    ],
    color: '#8B0000',
    gradientColors: ['#A52A2A', '#8B0000'],
  },
  {
    id: 'world-of-hyatt',
    name: 'World of Hyatt',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 4, description: '4x at Hyatt hotels' },
      { category: 'dining', multiplier: 2, description: '2x at restaurants' },
      { category: 'travel', multiplier: 2, description: '2x on airline tickets' },
      { category: 'transit', multiplier: 2, description: '2x on local transit and commuting' },
      { category: 'gym', multiplier: 2, description: '2x on gym memberships' },
    ],
    color: '#1C1C1C',
    gradientColors: ['#333333', '#1C1C1C'],
  },
  {
    id: 'delta-skymiles-gold',
    name: 'Delta SkyMiles Gold',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 150,
    baseReward: 1,
    rewardType: 'miles',
    rewardStructure: [
      { category: 'travel', multiplier: 2, description: '2x on Delta purchases' },
      { category: 'dining', multiplier: 2, description: '2x at restaurants' },
      { category: 'grocery', multiplier: 2, description: '2x at U.S. supermarkets' },
    ],
    color: '#003366',
    gradientColors: ['#003366', '#001a33'],
  },
  {
    id: 'united-explorer',
    name: 'United Explorer',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    baseReward: 1,
    rewardType: 'miles',
    rewardStructure: [
      { category: 'travel', multiplier: 2, description: '2x on United purchases' },
      { category: 'dining', multiplier: 2, description: '2x at restaurants' },
      { category: 'travel', multiplier: 2, description: '2x on hotel stays' },
    ],
    color: '#0033A0',
    gradientColors: ['#0033A0', '#001F5C'],
  },
  {
    id: 'southwest-priority',
    name: 'Southwest Priority',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 149,
    baseReward: 1,
    rewardType: 'points',
    rewardStructure: [
      { category: 'travel', multiplier: 3, description: '3x on Southwest purchases' },
      { category: 'transit', multiplier: 2, description: '2x on rideshare' },
      { category: 'online_shopping', multiplier: 2, description: '2x on internet, cable, phone, streaming' },
    ],
    color: '#304CB2',
    gradientColors: ['#304CB2', '#1a2d6b'],
  },
];

export const getCardById = (id: string): CreditCard | undefined => {
  return CREDIT_CARDS.find((card) => card.id === id);
};

export const getCardsByIssuer = (issuer: string): CreditCard[] => {
  return CREDIT_CARDS.filter((card) => card.issuer === issuer);
};

export const searchCards = (query: string): CreditCard[] => {
  const lowerQuery = query.toLowerCase();
  return CREDIT_CARDS.filter(
    (card) =>
      card.name.toLowerCase().includes(lowerQuery) ||
      card.issuer.toLowerCase().includes(lowerQuery)
  );
};
