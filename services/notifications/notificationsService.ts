import * as Notifications from 'expo-notifications';

/**
 * notificationsService.ts
 * - Minimal wrapper around expo-notifications.
 * - Request permissions and provide helper to send local notifications.
 */

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function sendLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}
