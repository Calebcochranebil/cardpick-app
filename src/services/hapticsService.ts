import * as Haptics from 'expo-haptics';

export const hapticTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const hapticWarning = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

export const hapticSelection = () => {
  Haptics.selectionAsync();
};
