import { ENV } from '../config/env';
import { Merchant, MCCCategory } from '../types';

const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

// Map Google Places types to our MCC categories
const PLACE_TYPE_TO_CATEGORY: Record<string, MCCCategory> = {
  // Dining
  restaurant: 'dining',
  cafe: 'dining',
  bakery: 'dining',
  bar: 'dining',
  coffee_shop: 'dining',
  fast_food_restaurant: 'dining',
  pizza_restaurant: 'dining',
  steak_house: 'dining',
  sushi_restaurant: 'dining',
  ice_cream_shop: 'dining',
  sandwich_shop: 'dining',

  // Grocery
  supermarket: 'grocery',
  grocery_store: 'grocery',
  food_store: 'grocery',

  // Gas
  gas_station: 'gas',
  ev_charging_station: 'gas',

  // Drugstore
  pharmacy: 'drugstore',
  drugstore: 'drugstore',

  // Travel
  airport: 'travel',
  hotel: 'travel',
  lodging: 'travel',
  travel_agency: 'travel',
  car_rental: 'travel',

  // Entertainment
  movie_theater: 'entertainment',
  amusement_park: 'entertainment',
  bowling_alley: 'entertainment',
  casino: 'entertainment',
  night_club: 'entertainment',

  // Transit
  bus_station: 'transit',
  subway_station: 'transit',
  train_station: 'transit',
  taxi_stand: 'transit',

  // Shopping
  shopping_mall: 'online_shopping',
  department_store: 'online_shopping',
  clothing_store: 'online_shopping',
  electronics_store: 'online_shopping',
};

// MCC codes for categories (approximate)
const CATEGORY_TO_MCC: Record<MCCCategory, string> = {
  dining: '5812',
  grocery: '5411',
  gas: '5541',
  drugstore: '5912',
  travel: '4511',
  entertainment: '7832',
  streaming: '4899',
  transit: '4121',
  online_shopping: '5999',
  other: '5999',
};

interface PlaceResult {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  types: string[];
  formattedAddress?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface NearbySearchResponse {
  places?: PlaceResult[];
}

export const searchNearbyPlaces = async (
  latitude: number,
  longitude: number,
  radiusMeters: number = 50
): Promise<PlaceResult[]> => {
  try {
    const response = await fetch(PLACES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': ENV.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.types,places.formattedAddress,places.location',
      },
      body: JSON.stringify({
        locationRestriction: {
          circle: {
            center: { latitude, longitude },
            radius: radiusMeters,
          },
        },
        maxResultCount: 5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Places API error:', errorText);
      return [];
    }

    const data: NearbySearchResponse = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};

export const getCategoryFromPlaceTypes = (types: string[]): MCCCategory => {
  for (const type of types) {
    const category = PLACE_TYPE_TO_CATEGORY[type];
    if (category) {
      return category;
    }
  }
  return 'other';
};

export const placeToMerchant = (place: PlaceResult): Merchant => {
  const category = getCategoryFromPlaceTypes(place.types);

  return {
    id: place.id,
    name: place.displayName.text,
    category,
    mccCode: CATEGORY_TO_MCC[category],
    address: place.formattedAddress,
    latitude: place.location.latitude,
    longitude: place.location.longitude,
  };
};

export const detectNearbyMerchant = async (
  latitude: number,
  longitude: number
): Promise<Merchant | null> => {
  const merchants = await detectNearbyMerchants(latitude, longitude);
  return merchants.length > 0 ? merchants[0] : null;
};

export const detectNearbyMerchants = async (
  latitude: number,
  longitude: number
): Promise<Merchant[]> => {
  // Try small radius first
  let places = await searchNearbyPlaces(latitude, longitude, 50);

  if (places.length === 0) {
    // Try with larger radius
    places = await searchNearbyPlaces(latitude, longitude, 150);
  }

  if (places.length === 0) {
    // Try even larger radius
    places = await searchNearbyPlaces(latitude, longitude, 300);
  }

  return places.map(placeToMerchant);
};

export const getNearbyMerchants = async (
  latitude: number,
  longitude: number,
  radiusMeters: number = 200
): Promise<Merchant[]> => {
  const places = await searchNearbyPlaces(latitude, longitude, radiusMeters);
  return places.map(placeToMerchant);
};
