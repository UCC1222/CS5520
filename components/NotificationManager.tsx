import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

const TRIGGER_TYPE = {
  DATE: 'date' as const
};

export default function NotificationManager() {
  const verifyPermission = async () => {
    const permissionStatus = await Notifications.getPermissionsAsync();
    if (permissionStatus.granted) return true;

    const requestStatus = await Notifications.requestPermissionsAsync();
    return requestStatus.granted;
  };

  const scheduleNotificationHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      Alert.alert("Permission required", "We need your permission to send notifications.");
      return;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Location Reminder! 📍",
          body: "Don't forget to check your saved location!",
          data: { screen: 'profile' },
        },
        trigger: {
          seconds: 5,
          repeats: false
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
        title="Set Location Reminder" 
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
