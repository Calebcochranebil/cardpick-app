import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { HomeScreen, RecommendationScreen, MyCardsScreen, OnboardingScreen } from './src/screens';
import { isOnboardingComplete, setOnboardingComplete } from './src/services/onboardingService';
import { CardProvider } from './src/context/CardContext';

type RootStackParamList = {
  MainTabs: undefined;
  Recommendation: undefined;
};

type TabParamList = {
  Home: undefined;
  MyCards: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const color = focused ? '#3B82F6' : '#555';

  const getIcon = () => {
    switch (name) {
      case 'Find':
        return (
          <View style={styles.tabIconWrapper}>
            {/* Dollar sign with signal waves */}
            <View style={[styles.findIcon, focused && styles.findIconFocused]}>
              <Text style={[styles.dollarText, { color }]}>$</Text>
            </View>
          </View>
        );
      case 'Cards':
        return (
          <View style={styles.tabIconWrapper}>
            {/* Stacked cards icon */}
            <View style={styles.walletIcon}>
              <View style={[styles.walletCard, styles.walletCardBack, { borderColor: color }]} />
              <View style={[styles.walletCard, styles.walletCardFront, { borderColor: color, backgroundColor: focused ? 'rgba(59,130,246,0.15)' : 'transparent' }]} />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.tabContainer}>
      {getIcon()}
      <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#1a1a1a',
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 28,
          paddingTop: 12,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Find" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MyCards"
        component={MyCardsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Cards" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const complete = await isOnboardingComplete();
    setShowOnboarding(!complete);
    setIsLoading(false);
  };

  const handleOnboardingComplete = async () => {
    await setOnboardingComplete();
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <SafeAreaProvider>
        <CardProvider>
          <StatusBar style="light" />
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </CardProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <CardProvider>
        <NavigationContainer
        theme={{
          dark: true,
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '800',
            },
          },
          colors: {
            primary: '#3B82F6',
            background: '#000',
            card: '#000',
            text: '#fff',
            border: '#1a1a1a',
            notification: '#3B82F6',
          },
        }}
      >
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000' },
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="Recommendation"
            component={RecommendationScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Navigator>
        </NavigationContainer>
      </CardProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    minWidth: 70,
  },
  tabIconWrapper: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 6,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  // Find tab icon
  findIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  findIconFocused: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  dollarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  // Wallet tab icon
  walletIcon: {
    width: 28,
    height: 22,
    position: 'relative',
  },
  walletCard: {
    position: 'absolute',
    width: 24,
    height: 16,
    borderWidth: 2,
    borderRadius: 4,
  },
  walletCardBack: {
    top: 0,
    left: 0,
    opacity: 0.5,
  },
  walletCardFront: {
    bottom: 0,
    right: 0,
  },
});
