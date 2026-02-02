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
import { LinearGradient } from 'expo-linear-gradient';
import {
  startBackgroundLocationTracking,
  stopBackgroundLocationTracking,
  isBackgroundTrackingActive,
} from '../services/geofencingService';
import { hapticTap } from '../services/hapticsService';

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
  const shimmerAnim = useRef(new Animated.Value(0)).current;

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
          toValue: 1.05,
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
          toValue: 0.7,
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
          toValue: -12,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer animation
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Ring animations - staggered
    const animateRing = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
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
    animateRing(ringAnim2, 1000);
    animateRing(ringAnim3, 2000);
  }, []);

  const handleTap = () => {
    hapticTap();
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
              outputRange: [0.5, 0.2, 0],
            }),
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.5],
                }),
              },
            ],
          },
        ]}
      />
    );
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.container}>
      {/* Gradient background */}
      <LinearGradient
        colors={['#0a0a0a', '#000', '#0a0a0a']}
        style={styles.backgroundGradient}
      />

      {/* Ambient glow */}
      <Animated.View style={[styles.ambientGlow, { opacity: glowAnim }]} />
      <View style={styles.ambientGlow2} />

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
          {renderRing(ringAnim1, 180)}
          {renderRing(ringAnim2, 180)}
          {renderRing(ringAnim3, 180)}

          {/* Outer glow */}
          <Animated.View
            style={[
              styles.outerGlow,
              {
                opacity: glowAnim,
                transform: [{ translateY: floatAnim }],
              },
            ]}
          />

          {/* Main button */}
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
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#1a1a1a', '#0d0d0d']}
                style={styles.tapButtonGradient}
              >
                {/* Shimmer effect */}
                <Animated.View
                  style={[
                    styles.shimmer,
                    { transform: [{ translateX: shimmerTranslate }] },
                  ]}
                />

                {/* Icon */}
                <View style={styles.iconContainer}>
                  <View style={styles.dollarCircle}>
                    <Text style={styles.dollarSign}>$</Text>
                  </View>
                  <View style={styles.waveContainer}>
                    <View style={[styles.wave, styles.wave1]} />
                    <View style={[styles.wave, styles.wave2]} />
                    <View style={[styles.wave, styles.wave3]} />
                  </View>
                </View>

                <Text style={styles.tapText}>TAP</Text>
                <Text style={styles.tapSubtext}>Find your best card</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer - Smart Notifications Toggle */}
        <View style={styles.footer}>
          <View style={styles.smartNotificationCard}>
            <View style={styles.notificationIcon}>
              <View style={styles.bellIcon} />
              {smartNotificationsEnabled && <View style={styles.bellDot} />}
            </View>
            <View style={styles.smartNotificationInfo}>
              <Text style={styles.smartNotificationTitle}>Smart Alerts</Text>
              <Text style={styles.smartNotificationDesc}>
                Auto-notify at checkout
              </Text>
            </View>
            <Switch
              value={smartNotificationsEnabled}
              onValueChange={handleToggleSmartNotifications}
              disabled={isLoading}
              trackColor={{ false: '#222', true: '#3B82F6' }}
              thumbColor={smartNotificationsEnabled ? '#fff' : '#666'}
              ios_backgroundColor="#222"
            />
          </View>
          {smartNotificationsEnabled && (
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Tracking your location</Text>
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
    bottom: 0,
  },
  ambientGlow: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.5 - 150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#3B82F6',
    opacity: 0.15,
  },
  ambientGlow2: {
    position: 'absolute',
    top: height * 0.35,
    left: width * 0.5 - 100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#8B5CF6',
    opacity: 0.08,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
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
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  outerGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#3B82F6',
    opacity: 0.2,
  },
  tapButtonWrapper: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },
  tapButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  tapButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 100,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: [{ skewX: '-20deg' }],
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dollarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dollarSign: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  waveContainer: {
    marginLeft: -8,
  },
  wave: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#3B82F6',
    borderTopRightRadius: 50,
    transform: [{ rotate: '45deg' }],
    marginBottom: 2,
  },
  wave1: {
    width: 14,
    height: 14,
    opacity: 1,
  },
  wave2: {
    width: 22,
    height: 22,
    opacity: 0.6,
    marginTop: -16,
    marginLeft: 4,
  },
  wave3: {
    width: 30,
    height: 30,
    opacity: 0.3,
    marginTop: -24,
    marginLeft: 8,
  },
  tapText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
  },
  tapSubtext: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  smartNotificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    width: '100%',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bellIcon: {
    width: 16,
    height: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#3B82F6',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#111',
  },
  smartNotificationInfo: {
    flex: 1,
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
