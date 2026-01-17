import * as Location from 'expo-location';
import { Merchant, MCCCategory } from '../types';
import { ENV } from '../config/env';
import { detectNearbyMerchant as detectWithPlaces, detectNearbyMerchants as detectMultipleWithPlaces } from './placesService';

// Demo merchants for testing
const DEMO_MERCHANTS: Record<MCCCategory, Merchant[]> = {
  dining: [
    {
      id: 'chipotle-1',
      name: 'Chipotle Mexican Grill',
      category: 'dining',
      mccCode: '5812',
      address: '123 Main St',
    },
    {
      id: 'starbucks-1',
      name: 'Starbucks',
      category: 'dining',
      mccCode: '5814',
      address: '456 Oak Ave',
    },
    {
      id: 'olive-garden-1',
      name: 'Olive Garden',
      category: 'dining',
      mccCode: '5812',
      address: '789 Elm Blvd',
    },
  ],
  grocery: [
    {
      id: 'whole-foods-1',
      name: 'Whole Foods Market',
      category: 'grocery',
      mccCode: '5411',
      address: '321 Market St',
    },
    {
      id: 'trader-joes-1',
      name: "Trader Joe's",
      category: 'grocery',
      mccCode: '5411',
      address: '654 Grocery Lane',
    },
    {
      id: 'kroger-1',
      name: 'Kroger',
      category: 'grocery',
      mccCode: '5411',
      address: '987 Shop Way',
    },
  ],
  gas: [
    {
      id: 'shell-1',
      name: 'Shell',
      category: 'gas',
      mccCode: '5541',
      address: '111 Fuel Dr',
    },
    {
      id: 'exxon-1',
      name: 'Exxon Mobil',
      category: 'gas',
      mccCode: '5541',
      address: '222 Gas Blvd',
    },
    {
      id: 'chevron-1',
      name: 'Chevron',
      category: 'gas',
      mccCode: '5542',
      address: '333 Petro Ave',
    },
  ],
  drugstore: [
    {
      id: 'cvs-1',
      name: 'CVS Pharmacy',
      category: 'drugstore',
      mccCode: '5912',
      address: '444 Health St',
    },
    {
      id: 'walgreens-1',
      name: 'Walgreens',
      category: 'drugstore',
      mccCode: '5912',
      address: '555 Pharmacy Rd',
    },
    {
      id: 'rite-aid-1',
      name: 'Rite Aid',
      category: 'drugstore',
      mccCode: '5912',
      address: '666 Med Lane',
    },
  ],
  travel: [
    {
      id: 'marriott-1',
      name: 'Marriott Hotel',
      category: 'travel',
      mccCode: '7011',
      address: '777 Travel Blvd',
    },
    {
      id: 'united-1',
      name: 'United Airlines',
      category: 'travel',
      mccCode: '4511',
      address: 'Airport Terminal A',
    },
  ],
  entertainment: [
    {
      id: 'amc-1',
      name: 'AMC Theatres',
      category: 'entertainment',
      mccCode: '7832',
      address: '888 Cinema Way',
    },
  ],
  streaming: [
    {
      id: 'netflix-1',
      name: 'Netflix',
      category: 'streaming',
      mccCode: '4899',
      address: 'Online',
    },
  ],
  transit: [
    {
      id: 'uber-1',
      name: 'Uber',
      category: 'transit',
      mccCode: '4121',
      address: 'Mobile App',
    },
  ],
  online_shopping: [
    {
      id: 'amazon-1',
      name: 'Amazon',
      category: 'online_shopping',
      mccCode: '5999',
      address: 'Online',
    },
  ],
  other: [
    {
      id: 'generic-1',
      name: 'Local Store',
      category: 'other',
      mccCode: '5999',
      address: '999 Generic St',
    },
  ],
};

// Demo mode categories to cycle through
export const DEMO_CATEGORIES: MCCCategory[] = [
  'gas',
  'grocery',
  'dining',
  'drugstore',
];

let currentDemoIndex = 0;

export const getCurrentDemoCategory = (): MCCCategory => {
  return DEMO_CATEGORIES[currentDemoIndex];
};

export const getNextDemoCategory = (): MCCCategory => {
  currentDemoIndex = (currentDemoIndex + 1) % DEMO_CATEGORIES.length;
  return DEMO_CATEGORIES[currentDemoIndex];
};

export const setDemoCategory = (category: MCCCategory): void => {
  const index = DEMO_CATEGORIES.indexOf(category);
  if (index !== -1) {
    currentDemoIndex = index;
  }
};

export const getRandomMerchant = (category: MCCCategory): Merchant => {
  const merchants = DEMO_MERCHANTS[category];
  const randomIndex = Math.floor(Math.random() * merchants.length);
  return merchants[randomIndex];
};

export const getMerchantForDemo = (): Merchant => {
  const category = getCurrentDemoCategory();
  return getRandomMerchant(category);
};

export const getNextDemoMerchant = (): Merchant => {
  const category = getNextDemoCategory();
  return getRandomMerchant(category);
};

// Request location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Check if location permission is granted
export const checkLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) {
        return null;
      }
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Detect nearby merchant using real location + Google Places
export const detectNearbyMerchant = async (): Promise<{
  merchant: Merchant | null;
  isDemo: boolean;
}> => {
  // If demo mode is forced, return demo merchant
  if (ENV.DEMO_MODE) {
    return { merchant: getMerchantForDemo(), isDemo: true };
  }

  // Try real location
  if (ENV.USE_REAL_LOCATION) {
    try {
      const location = await getCurrentLocation();

      if (location) {
        const merchant = await detectWithPlaces(
          location.latitude,
          location.longitude
        );

        if (merchant) {
          return { merchant, isDemo: false };
        }
      }
    } catch (error) {
      console.error('Error detecting real location:', error);
    }
  }

  // Fallback to demo
  return { merchant: getMerchantForDemo(), isDemo: true };
};

// Detect multiple nearby merchants for selection
export const detectNearbyMerchants = async (): Promise<{
  merchants: Merchant[];
  isDemo: boolean;
}> => {
  // If demo mode is forced, return demo merchants
  if (ENV.DEMO_MODE) {
    const allDemoMerchants: Merchant[] = [];
    DEMO_CATEGORIES.forEach(cat => {
      allDemoMerchants.push(...DEMO_MERCHANTS[cat].slice(0, 2));
    });
    return { merchants: allDemoMerchants.slice(0, 5), isDemo: true };
  }

  // Try real location
  if (ENV.USE_REAL_LOCATION) {
    try {
      const location = await getCurrentLocation();

      if (location) {
        const merchants = await detectMultipleWithPlaces(
          location.latitude,
          location.longitude
        );

        if (merchants.length > 0) {
          return { merchants, isDemo: false };
        }
      }
    } catch (error) {
      console.error('Error detecting nearby merchants:', error);
    }
  }

  // Fallback to demo merchants
  const allDemoMerchants: Merchant[] = [];
  DEMO_CATEGORIES.forEach(cat => {
    allDemoMerchants.push(...DEMO_MERCHANTS[cat].slice(0, 2));
  });
  return { merchants: allDemoMerchants.slice(0, 5), isDemo: true };
};

export const getCategoryDisplayName = (category: MCCCategory): string => {
  const displayNames: Record<MCCCategory, string> = {
    dining: 'Dining',
    grocery: 'Grocery',
    gas: 'Gas Station',
    travel: 'Travel',
    drugstore: 'Drugstore',
    entertainment: 'Entertainment',
    streaming: 'Streaming',
    transit: 'Transit',
    online_shopping: 'Online Shopping',
    other: 'Other',
  };
  return displayNames[category];
};

export const getCategoryEmoji = (category: MCCCategory): string => {
  const emojis: Record<MCCCategory, string> = {
    dining: '',
    grocery: '',
    gas: '',
    travel: '',
    drugstore: '',
    entertainment: '',
    streaming: '',
    transit: '',
    online_shopping: '',
    other: '',
  };
  return emojis[category];
};
