import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

const TRIGGER_TYPE = {
  DATE: 'date' as const
};

export const verifyPermission = async () => {
  const permissionStatus = await Notifications.getPermissionsAsync();
  if (permissionStatus.granted) return true;

  const requestStatus = await Notifications.requestPermissionsAsync();
  return requestStatus.granted;
};

export default function NotificationManager() {
  const scheduleNotificationHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      Alert.alert("Permission required", "We need your permission to send notifications.");
      return;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Goal Reminder! ",
          body: "Don't forget to add your daily goal!",
          data: { screen: 'profile' },
        },
        trigger: {
          seconds: 5,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        } as Notifications.TimeIntervalTriggerInput,
      });
      
      Alert.alert("Success", "Reminder has been set!");
      console.log('Scheduled notification:', notificationId);
    } catch (error) {
      Alert.alert("Error", "Failed to set reminder. Please try again.");
      console.error('Error scheduling notification:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Remind me to add my daily goal" 
        onPress={scheduleNotificationHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
});
