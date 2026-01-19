import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Merchant, Recommendation } from '../types';
import { getCategoryDisplayName } from './locationService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  // Set notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('card-recommendations', {
      name: 'Card Recommendations',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3B82F6',
    });
  }

  return true;
};

export const sendCardRecommendationNotification = async (
  merchant: Merchant,
  recommendation: Recommendation
): Promise<void> => {
  const hasPermission = await requestNotificationPermissions();

  if (!hasPermission) {
    console.log('Cannot send notification - no permission');
    return;
  }

  const categoryName = getCategoryDisplayName(merchant.category);
  const rewardText = recommendation.card.rewardType === 'cashback'
    ? `${recommendation.multiplier}% back`
    : `${recommendation.multiplier}x ${recommendation.card.rewardType}`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Use ${recommendation.card.name}`,
      body: `At ${merchant.name} (${categoryName}), earn ${rewardText}!`,
      data: {
        merchantId: merchant.id,
        cardId: recommendation.card.id,
      },
      ...(Platform.OS === 'android' && { channelId: 'card-recommendations' }),
    },
    trigger: null, // Send immediately
  });
};

export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
