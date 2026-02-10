import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import { getUserProfile } from './authService';

const DEVICE_ID_KEY = '@stax_device_id';

type EventType =
  | 'card_added'
  | 'card_removed'
  | 'upsell_tapped'
  | 'apply_tapped'
  | 'notification_tapped'
  | 'sign_in'
  | 'sign_out';

const getDeviceId = async (): Promise<string> => {
  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) return stored;

  const deviceId = `device_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
};

const trackEvent = async (
  eventType: EventType,
  eventData: Record<string, any> = {}
) => {
  try {
    const profile = await getUserProfile();
    const deviceId = await getDeviceId();

    await supabase.from('analytics_events').insert({
      user_email: profile?.email || null,
      device_id: deviceId,
      event_type: eventType,
      event_data: eventData,
    });
  } catch (error) {
    // Silent fail — analytics should never block UX
    console.warn('Analytics error:', error);
  }
};

export const trackCardAdded = (cardId: string) =>
  trackEvent('card_added', { card_id: cardId });

export const trackCardRemoved = (cardId: string) =>
  trackEvent('card_removed', { card_id: cardId });

export const trackUpsellTapped = (cardId: string, merchantCategory?: string) =>
  trackEvent('upsell_tapped', { card_id: cardId, merchant_category: merchantCategory });

export const trackApplyTapped = (cardId: string) =>
  trackEvent('apply_tapped', { card_id: cardId });

export const trackNotificationTapped = (data?: Record<string, any>) =>
  trackEvent('notification_tapped', data || {});

export const trackSignIn = (provider: string) =>
  trackEvent('sign_in', { provider });

export const trackSignOut = () => trackEvent('sign_out');
