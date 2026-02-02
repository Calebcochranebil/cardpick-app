import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
const PARTICLE_COUNT = 16;

interface ConfettiProps {
  visible: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  startX: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ visible, onComplete }) => {
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 6,
      startX: width * 0.5 + (Math.random() - 0.5) * width * 0.6,
    }))
  ).current;

  useEffect(() => {
    if (!visible) return;

    // Reset all particles
    particles.forEach((p) => {
      p.x.setValue(0);
      p.y.setValue(0);
      p.rotate.setValue(0);
      p.opacity.setValue(1);
    });

    const animations = particles.map((p) => {
      const spreadX = (Math.random() - 0.5) * width * 0.8;
      const fallDistance = height * 0.5 + Math.random() * height * 0.3;

      return Animated.parallel([
        Animated.timing(p.x, {
          toValue: spreadX,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(p.y, {
            toValue: -80 - Math.random() * 60,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(p.y, {
            toValue: fallDistance,
            duration: 2100,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(p.rotate, {
          toValue: 4 + Math.random() * 8,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      onComplete?.();
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        const spin = p.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: p.startX,
                top: height * 0.3,
                width: p.size,
                height: p.size * 0.6,
                backgroundColor: p.color,
                borderRadius: 2,
                opacity: p.opacity,
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { rotate: spin },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});
