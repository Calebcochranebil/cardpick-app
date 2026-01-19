import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import {
  startBackgroundLocationTracking,
  stopBackgroundLocationTracking,
  isBackgroundTrackingActive,
} from '../services/geofencingService';

type RootStackParamList = {
  Home: undefined;
  Recommendation: undefined;
  MyCards: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const { width, height } = Dimensions.get('window');

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [smartNotificationsEnabled, setSmartNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const ringAnim1 = useRef(new Animated.Value(0)).current;
  const ringAnim2 = useRef(new Animated.Value(0)).current;
  const ringAnim3 = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Check if background tracking is active on screen focus
  useFocusEffect(
    useCallback(() => {
      const checkTrackingStatus = async () => {
        const isActive = await isBackgroundTrackingActive();
        setSmartNotificationsEnabled(isActive);
      };
      checkTrackingStatus();
    }, [])
  );

  const handleToggleSmartNotifications = async (value: boolean) => {
    setIsLoading(true);
    try {
      if (value) {
        const started = await startBackgroundLocationTracking();
        if (started) {
          setSmartNotificationsEnabled(true);
        } else {
          Alert.alert(
            'Permission Required',
            'Stax needs "Always" location permission to send smart notifications when you arrive at stores. Please enable it in your device settings.',
            [{ text: 'OK' }]
          );
        }
      } else {
        await stopBackgroundLocationTracking();
        setSmartNotificationsEnabled(false);
      }
    } catch (error) {
      console.error('Error toggling smart notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Subtle pulse animation for main button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ring animations - staggered
    const animateRing = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateRing(ringAnim1, 0);
    animateRing(ringAnim2, 833);
    animateRing(ringAnim3, 1666);
  }, []);

  const handleTap = () => {
    navigation.navigate('Recommendation');
  };

  const renderRing = (anim: Animated.Value, baseSize: number) => {
    return (
      <Animated.View
        style={[
          styles.ring,
          {
            width: baseSize,
            height: baseSize,
            borderRadius: baseSize / 2,
            opacity: anim.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0.4, 0.2, 0],
            }),
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.2],
                }),
              },
            ],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundGlow} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Stax</Text>
            <Text style={styles.subtitle}>Stop leaving money on the table</Text>
          </View>
        </View>

        {/* Main Tap Area */}
        <View style={styles.tapContainer}>
          {renderRing(ringAnim1, 200)}
          {renderRing(ringAnim2, 200)}
          {renderRing(ringAnim3, 200)}

          <Animated.View
            style={[
              styles.tapButtonOuter,
              {
                opacity: glowAnim,
                transform: [{ translateY: floatAnim }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.tapButtonWrapper,
              {
                transform: [
                  { scale: pulseAnim },
                  { translateY: floatAnim },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.tapButton}
              onPress={handleTap}
              activeOpacity={0.85}
            >
              <View style={styles.tapButtonInner}>
                {/* NFC Icon */}
                <View style={styles.nfcIcon}>
                  <View style={styles.nfcWave1} />
                  <View style={styles.nfcWave2} />
                  <View style={styles.nfcWave3} />
                  <View style={styles.nfcDot} />
                </View>
                <Text style={styles.tapText}>TAP</Text>
                <Text style={styles.tapSubtext}>to find best card</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer - Smart Notifications Toggle */}
        <View style={styles.footer}>
          <View style={styles.smartNotificationCard}>
            <View style={styles.smartNotificationInfo}>
              <Text style={styles.smartNotificationTitle}>Smart Notifications</Text>
              <Text style={styles.smartNotificationDesc}>
                Get notified which card to use when you arrive at stores
              </Text>
            </View>
            <Switch
              value={smartNotificationsEnabled}
              onValueChange={handleToggleSmartNotifications}
              disabled={isLoading}
              trackColor={{ false: '#333', true: '#3B82F6' }}
              thumbColor={smartNotificationsEnabled ? '#fff' : '#888'}
              ios_backgroundColor="#333"
            />
          </View>
          {smartNotificationsEnabled && (
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Location tracking active</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: '#000',
    opacity: 0.8,
  },
  backgroundGlow: {
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.5 - 150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#3B82F6',
    opacity: 0.08,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 17,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  tapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  tapButtonOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#3B82F6',
  },
  tapButtonWrapper: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  tapButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tapButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nfcWave1: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#3B82F6',
    borderTopRightRadius: 18,
    transform: [{ rotate: '45deg' }],
  },
  nfcWave2: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#3B82F6',
    borderTopRightRadius: 32,
    transform: [{ rotate: '45deg' }],
    opacity: 0.6,
  },
  nfcWave3: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#3B82F6',
    borderTopRightRadius: 46,
    transform: [{ rotate: '45deg' }],
    opacity: 0.3,
  },
  nfcDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  tapText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 3,
  },
  tapSubtext: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  smartNotificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252525',
    width: '100%',
  },
  smartNotificationInfo: {
    flex: 1,
    marginRight: 12,
  },
  smartNotificationTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  smartNotificationDesc: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  activeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
  },
});
