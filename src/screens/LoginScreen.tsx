import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInWithApple, continueAsGuest } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: 'google' | 'apple' | 'guest') => {
    setLoading(provider);
    try {
      if (provider === 'google') await signInWithGoogle();
      else if (provider === 'apple') await signInWithApple();
      else await continueAsGuest();
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>Stax</Text>
          <Text style={styles.tagline}>
            Maximize every swipe.
          </Text>
        </View>

        <View style={styles.buttons}>
          {/* Google */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => handleSignIn('google')}
            disabled={loading !== null}
            activeOpacity={0.8}
          >
            {loading === 'google' ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            )}
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity
            style={styles.appleButton}
            onPress={() => handleSignIn('apple')}
            disabled={loading !== null}
            activeOpacity={0.8}
          >
            {loading === 'apple' ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.appleButtonText}>Sign in with Apple</Text>
            )}
          </TouchableOpacity>

          {/* Guest */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => handleSignIn('guest')}
            disabled={loading !== null}
          >
            {loading === 'guest' ? (
              <ActivityIndicator color="#6B7280" />
            ) : (
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 17,
    color: '#6B7280',
    marginTop: 8,
  },
  buttons: {
    gap: 12,
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
  appleButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  appleButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
  guestButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '500',
  },
});
