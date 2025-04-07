import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const TRIGGER_TYPE = {
  DATE: 'date' as const
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const verifyPermission = async () => {
  const permissionStatus = await Notifications.getPermissionsAsync();
  if (permissionStatus.granted) return true;

  const requestStatus = await Notifications.requestPermissionsAsync();
  return requestStatus.granted;
};

export default function NotificationManager() {
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    const configurePushNotifications = async () => {
      try {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
          Alert.alert("Permission required", "Please enable notifications in your device settings");
          return;
        }

        // Configure Android channel
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        const projectId = "39aa660a-92ec-436c-8d32-bf8fd3e6dc8e";
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        });
        setPushToken(token.data);
        console.log('Push Token:', token.data);
      } catch (error) {
        console.error('Error configuring push notifications:', error);
        Alert.alert("Error", "Failed to configure push notifications");
      }
    };

    configurePushNotifications();
  }, []);

  const getPushToken = async () => {
    try {
      const projectId = "39aa660a-92ec-436c-8d32-bf8fd3e6dc8e";
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      setPushToken(token.data);
      console.log('Push Token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  };

  const sendTestNotification = async () => {
    const token = pushToken || await getPushToken();
    if (!token) {
      Alert.alert("Error", "Failed to get push token");
      return;
    }

    try {
      console.log('Sending notification to token:', token);
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          to: token,
          title: "Test Notification",
          body: "This is a test notification",
          sound: "default",
          priority: "high",
        })
      });

      const result = await response.json();
      console.log('Notification response:', result);

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      Alert.alert("Success", "Test notification sent successfully");
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert("Error", "Failed to send test notification");
    }
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
          title: "Daily Goal Reminder! ",
          body: "Don't forget to add your daily goal!",
          data: { screen: 'profile' },
          sound: true,
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
        title="Send Test Notification"
        onPress={sendTestNotification}
      />
      <View style={styles.spacer} />
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
  spacer: {
    height: 10,
  },
});
