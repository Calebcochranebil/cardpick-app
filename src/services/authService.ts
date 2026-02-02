import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

WebBrowser.maybeCompleteAuthSession();

const DEVICE_ID_KEY = '@stax_device_id';

const getRedirectUrl = () => {
  // In Expo Go, use the Expo auth proxy; in dev builds / standalone, use the native scheme
  const isExpoGo = Constants.appOwnership === 'expo';
  return makeRedirectUri({
    scheme: isExpoGo ? undefined : 'com.stax.app',
    path: 'auth/callback',
  });
};

export const getDeviceId = async (): Promise<string> => {
  // Try stored ID first
  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) return stored;

  // Generate from platform identifiers
  let deviceId: string;
  if (Platform.OS === 'ios') {
    deviceId = (await Application.getIosIdForVendorAsync()) || '';
  } else {
    deviceId = Application.getAndroidId() || '';
  }

  // Fallback to random ID
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
};

export const signInWithGoogle = async () => {
  const redirectUrl = getRedirectUrl();
  console.log('OAuth redirect URL:', redirectUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error('No OAuth URL returned');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type === 'success') {
    const url = new URL(result.url);
    // Handle fragment-based response (#access_token=...)
    const params = new URLSearchParams(
      url.hash ? url.hash.substring(1) : url.search.substring(1)
    );
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
      if (sessionError) throw sessionError;
      return sessionData.session;
    }
  }

  return null;
};

export const signInWithApple = async () => {
  const redirectUrl = getRedirectUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error('No OAuth URL returned');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type === 'success') {
    const url = new URL(result.url);
    const params = new URLSearchParams(
      url.hash ? url.hash.substring(1) : url.search.substring(1)
    );
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
      if (sessionError) throw sessionError;
      return sessionData.session;
    }
  }

  return null;
};

export const signInAnonymously = async () => {
  const deviceId = await getDeviceId();

  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: { device_id: deviceId },
    },
  });

  if (error) throw error;
  return data.session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};
