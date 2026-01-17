import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Merchant } from '../types';
import { getCategoryDisplayName } from '../services/locationService';

interface MerchantPickerProps {
  visible: boolean;
  merchants: Merchant[];
  selectedMerchant: Merchant | null;
  onSelect: (merchant: Merchant) => void;
  onClose: () => void;
  isDemo?: boolean;
}

export const MerchantPicker: React.FC<MerchantPickerProps> = ({
  visible,
  merchants,
  selectedMerchant,
  onSelect,
  onClose,
  isDemo = false,
}) => {
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      dining: 'fork',
      grocery: 'cart',
      gas: 'fuel',
      drugstore: 'pill',
      travel: 'plane',
      entertainment: 'film',
      streaming: 'play',
      transit: 'bus',
      online_shopping: 'bag',
      other: 'store',
    };
    return icons[category] || 'store';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <Text style={styles.title}>Where are you?</Text>
          <Text style={styles.subtitle}>
            {isDemo ? 'Demo locations' : 'Select your current location'}
          </Text>

          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {merchants.map((merchant) => {
              const isSelected = selectedMerchant?.id === merchant.id;
              return (
                <TouchableOpacity
                  key={merchant.id}
                  style={[
                    styles.merchantRow,
                    isSelected && styles.merchantRowSelected,
                  ]}
                  onPress={() => {
                    onSelect(merchant);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.iconContainer,
                    isSelected && styles.iconContainerSelected,
                  ]}>
                    <View style={styles.categoryDot} />
                  </View>

                  <View style={styles.merchantInfo}>
                    <Text style={[
                      styles.merchantName,
                      isSelected && styles.merchantNameSelected,
                    ]}>
                      {merchant.name}
                    </Text>
                    <Text style={styles.merchantCategory}>
                      {getCategoryDisplayName(merchant.category)}
                      {merchant.address && ` - ${merchant.address}`}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>OK</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  list: {
    maxHeight: 300,
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  merchantRowSelected: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconContainerSelected: {
    backgroundColor: '#3B82F6',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6B7280',
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  merchantNameSelected: {
    color: '#3B82F6',
  },
  merchantCategory: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 2,
  },
  checkmark: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
