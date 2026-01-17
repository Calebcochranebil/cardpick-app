import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';

import { HomeScreen, RecommendationScreen, MyCardsScreen } from './src/screens';

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
  const getIcon = () => {
    switch (name) {
      case 'Tap':
        return (
          <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
            <View style={styles.nfcIconSmall}>
              <View style={[styles.nfcWaveSmall, focused && styles.nfcWaveFocused]} />
            </View>
          </View>
        );
      case 'My Cards':
        return (
          <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
            <View style={[styles.cardIconSmall, focused && styles.cardIconFocused]}>
              <View style={[styles.cardLine, focused && styles.cardLineFocused]} />
              <View style={[styles.cardLine, focused && styles.cardLineFocused]} />
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
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
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
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Tap" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MyCards"
        component={MyCardsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="My Cards" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  tabIconFocused: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  tabLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: '#3B82F6',
  },
  nfcIconSmall: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcWaveSmall: {
    width: 16,
    height: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#6B7280',
    borderTopRightRadius: 16,
    transform: [{ rotate: '45deg' }],
  },
  nfcWaveFocused: {
    borderColor: '#3B82F6',
  },
  cardIconSmall: {
    width: 20,
    height: 14,
    borderWidth: 2,
    borderColor: '#6B7280',
    borderRadius: 3,
    padding: 2,
    justifyContent: 'space-between',
  },
  cardIconFocused: {
    borderColor: '#3B82F6',
  },
  cardLine: {
    height: 2,
    backgroundColor: '#6B7280',
    borderRadius: 1,
  },
  cardLineFocused: {
    backgroundColor: '#3B82F6',
  },
});
