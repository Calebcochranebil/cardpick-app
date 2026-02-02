import { supabase } from '../config/supabase';
import { getDeviceId } from './authService';

type EventType =
  | 'card_added'
  | 'card_removed'
  | 'upsell_tapped'
  | 'apply_tapped'
  | 'notification_tapped'
  | 'sign_in'
  | 'sign_out';

const trackEvent = async (
  eventType: EventType,
  eventData: Record<string, any> = {}
) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const deviceId = await getDeviceId();

    await supabase.from('analytics_events').insert({
      user_id: session?.user?.id || null,
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
