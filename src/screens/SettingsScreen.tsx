import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { resetToDefaults } from '../services/userCardsService';

type RootStackParamList = {
  MainTabs: undefined;
  Settings: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: signOut,
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Wallet',
      'Reset to default cards? This will remove all your current cards.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetToDefaults(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.card}>
          {user ? (
            <>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{user.firstName} {user.lastName}</Text>
              <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
              <Text style={[styles.label, { marginTop: 16 }]}>Phone</Text>
              <Text style={styles.value}>{user.phone}</Text>
            </>
          ) : (
            <Text style={styles.value}>Not signed in</Text>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACTIONS</Text>
        <TouchableOpacity style={styles.actionRow} onPress={handleReset}>
          <Text style={styles.actionText}>Reset Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionRow, styles.destructiveRow]}
          onPress={handleSignOut}
        >
          <Text style={styles.destructiveText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#252525',
  },
  label: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 4,
  },
  actionRow: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#252525',
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  destructiveRow: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  destructiveText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
