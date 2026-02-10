import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

const USER_PROFILE_KEY = '@stax_user_profile';
const SESSION_EXPIRY_DAYS = 30;

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  loginAt: string;
}

export const signUp = async (profile: Omit<UserProfile, 'createdAt' | 'loginAt'>): Promise<UserProfile> => {
  const now = new Date().toISOString();
  const fullProfile: UserProfile = {
    ...profile,
    createdAt: now,
    loginAt: now,
  };

  // Save to Supabase
  try {
    await supabase.from('profiles').upsert(
      {
        email: profile.email,
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        created_at: now,
        last_login_at: now,
      },
      { onConflict: 'email' }
    );
  } catch (error) {
    console.warn('Failed to save profile to Supabase:', error);
  }

  // Save locally so they stay logged in
  await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(fullProfile));
  return fullProfile;
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
  if (!stored) return null;

  const profile = JSON.parse(stored) as UserProfile;

  // Check if session has expired (30 days)
  const loginDate = new Date(profile.loginAt).getTime();
  const now = Date.now();
  const daysSinceLogin = (now - loginDate) / (1000 * 60 * 60 * 24);

  if (daysSinceLogin > SESSION_EXPIRY_DAYS) {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    return null;
  }

  return profile;
};

export const signOut = async () => {
  await AsyncStorage.removeItem(USER_PROFILE_KEY);
};
