import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { searchNearbyPlaces } from './placesService';
import { getBestCard } from './recommendationEngine';
import { getUserCardIds } from './userCardsService';
import { sendCardRecommendationNotification } from './notificationService';
import { Merchant } from '../types';

const GEOFENCING_TASK = 'STAX_GEOFENCING_TASK';
const LOCATION_TRACKING_TASK = 'STAX_LOCATION_TRACKING_TASK';

// Track last notification to avoid spam
let lastNotificationTime = 0;
let lastNotifiedMerchantId: string | null = null;
const NOTIFICATION_COOLDOWN = 5 * 60 * 1000; // 5 minutes between notifications

// Define the background location task
TaskManager.defineTask(LOCATION_TRACKING_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];

    if (location) {
      await handleLocationUpdate(location.coords.latitude, location.coords.longitude);
    }
  }
});

// Handle location updates and check for nearby merchants
async function handleLocationUpdate(latitude: number, longitude: number): Promise<void> {
  const now = Date.now();

  // Check cooldown
  if (now - lastNotificationTime < NOTIFICATION_COOLDOWN) {
    return;
  }

  try {
    // Search for nearby places using Google Places API
    const merchants = await searchNearbyPlaces(latitude, longitude);

    if (merchants.length === 0) {
      return;
    }

    // Get the closest/most relevant merchant
    const merchant = merchants[0];

    // Don't notify for the same merchant repeatedly
    if (merchant.id === lastNotifiedMerchantId) {
      return;
    }

    // Get user's cards and find the best one
    const userCardIds = await getUserCardIds();
    if (userCardIds.length === 0) {
      return;
    }

    const recommendation = getBestCard(merchant, userCardIds);
    if (!recommendation) {
      return;
    }

    // Send notification
    await sendCardRecommendationNotification(merchant, recommendation);

    // Update tracking
    lastNotificationTime = now;
    lastNotifiedMerchantId = merchant.id;

    console.log(`Sent notification for ${merchant.name}: Use ${recommendation.card.name}`);
  } catch (error) {
    console.error('Error handling location update:', error);
  }
}

// Request background location permissions
export async function requestBackgroundLocationPermission(): Promise<boolean> {
  // First request foreground permission
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    console.log('Foreground location permission denied');
    return false;
  }

  // Then request background permission
  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    console.log('Background location permission denied');
    return false;
  }

  return true;
}

// Start background location tracking
export async function startBackgroundLocationTracking(): Promise<boolean> {
  const hasPermission = await requestBackgroundLocationPermission();
  if (!hasPermission) {
    return false;
  }

  // Check if already running
  const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
  if (isRunning) {
    console.log('Background location tracking already running');
    return true;
  }

  try {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60000, // Check every 60 seconds
      distanceInterval: 100, // Or when moved 100 meters
      deferredUpdatesInterval: 60000,
      deferredUpdatesDistance: 100,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Stax',
        notificationBody: 'Finding the best card for nearby stores',
        notificationColor: '#3B82F6',
      },
      pausesUpdatesAutomatically: false,
    });

    console.log('Background location tracking started');
    return true;
  } catch (error) {
    console.error('Error starting background location:', error);
    return false;
  }
}

// Stop background location tracking
export async function stopBackgroundLocationTracking(): Promise<void> {
  const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(LOCATION_TRACKING_TASK);
    console.log('Background location tracking stopped');
  }
}

// Check if background tracking is active
export async function isBackgroundTrackingActive(): Promise<boolean> {
  try {
    return await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
  } catch {
    return false;
  }
}

// Reset notification cooldown (useful for testing)
export function resetNotificationCooldown(): void {
  lastNotificationTime = 0;
  lastNotifiedMerchantId = null;
}
