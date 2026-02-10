import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: 'cards' | 'location' | 'notification';
  gradient: [string, string];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Add Your Cards',
    subtitle: 'Select the credit cards in your wallet. We\'ll remember them for you.',
    icon: 'cards',
    gradient: ['#3B82F6', '#1D4ED8'],
  },
  {
    id: '2',
    title: 'Shop Anywhere',
    subtitle: 'At checkout, we\'ll detect where you are and find the best card to use.',
    icon: 'location',
    gradient: ['#8B5CF6', '#6D28D9'],
  },
  {
    id: '3',
    title: 'Never Miss Rewards',
    subtitle: 'Get notified which card earns you the most points, cash back, or miles.',
    icon: 'notification',
    gradient: ['#10B981', '#059669'],
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderIcon = (icon: string, gradient: [string, string]) => {
    if (icon === 'cards') {
      return (
        <View style={styles.iconContainer}>
          <LinearGradient colors={gradient} style={[styles.card, styles.cardBack]} />
          <LinearGradient colors={gradient} style={[styles.card, styles.cardMiddle]} />
          <LinearGradient colors={gradient} style={[styles.card, styles.cardFront]}>
            <View style={styles.cardChip} />
            <View style={styles.cardLines}>
              <View style={styles.cardLine} />
              <View style={[styles.cardLine, { width: 40 }]} />
            </View>
          </LinearGradient>
        </View>
      );
    }

    if (icon === 'location') {
      return (
        <View style={styles.iconContainer}>
          <LinearGradient colors={gradient} style={styles.locationPin}>
            <View style={styles.locationPinInner} />
          </LinearGradient>
          <View style={styles.locationRing1} />
          <View style={styles.locationRing2} />
          <View style={styles.locationRing3} />
        </View>
      );
    }

    if (icon === 'notification') {
      return (
        <View style={styles.iconContainer}>
          <LinearGradient colors={gradient} style={styles.notificationBell}>
            <View style={styles.bellTop} />
            <View style={styles.bellBody} />
            <View style={styles.bellClapper} />
          </LinearGradient>
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>$</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.illustrationContainer}>
          {renderIcon(item.icon, item.gradient)}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Skip Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />

        {/* Pagination & Button */}
        <View style={styles.footer}>
          <View style={styles.pagination}>
            {slides.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 24, 8],
                extrapolate: 'clamp',
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    { width: dotWidth, opacity },
                  ]}
                />
              );
            })}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Card icon styles
  card: {
    width: 120,
    height: 76,
    borderRadius: 12,
    position: 'absolute',
  },
  cardBack: {
    transform: [{ rotate: '-15deg' }, { translateX: -30 }, { translateY: -10 }],
    opacity: 0.3,
  },
  cardMiddle: {
    transform: [{ rotate: '-5deg' }, { translateX: -10 }],
    opacity: 0.6,
  },
  cardFront: {
    transform: [{ rotate: '5deg' }, { translateX: 10 }],
    padding: 12,
    justifyContent: 'space-between',
  },
  cardChip: {
    width: 24,
    height: 18,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    opacity: 0.8,
  },
  cardLines: {
    gap: 4,
  },
  cardLine: {
    width: 60,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  // Location icon styles
  locationPin: {
    width: 60,
    height: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 14,
    transform: [{ rotate: '0deg' }],
  },
  locationPinInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  locationRing1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  locationRing2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  locationRing3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  // Notification icon styles
  notificationBell: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellTop: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    position: 'absolute',
    top: 8,
  },
  bellBody: {
    width: 40,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bellClapper: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    position: 'absolute',
    bottom: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 50,
    right: 50,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  badgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  textContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  authButtons: {
    gap: 12,
  },
  googleAuthButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  googleAuthText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
  appleAuthButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  appleAuthText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
  guestText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
