import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { saveUserLocation, getUserLocation } from '../Firebase/firestoreHelper';
import { getAuth } from 'firebase/auth';

export default function LocationManager() {
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [permissionResponse, requestPermission] = Location.useForegroundPermissions();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const loadSavedLocation = async () => {
      if (user) {
        try {
          const savedLocation = await getUserLocation(user.uid);
          if (savedLocation) {
            setPickedLocation(savedLocation);
          }
        } catch (error) {
          console.error('Error loading saved location:', error);
        }
      }
    };

    loadSavedLocation();
  }, [user]);

  const mapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

  const verifyPermission = async () => {
    if (permissionResponse?.granted) return true;

    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert("Permission required", "We need your permission to access location.");
      return false;
    }
    return true;
  };

  const locateUserHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) return;

    try {
      const location = await Location.getCurrentPositionAsync();
      setPickedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert("Could not fetch location", "Please try again later.");
    }
  };

  const saveLocationHandler = async () => {
    if (!pickedLocation || !user) {
      Alert.alert("No location selected", "Please select a location first.");
      return;
    }

    try {
      await saveUserLocation(pickedLocation.latitude, pickedLocation.longitude, user.uid);
      Alert.alert("Success", "Location saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save location. Please try again.");
    }
  };

  const getMapPreview = () => {
    if (!pickedLocation) return null;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${pickedLocation.latitude},${pickedLocation.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${pickedLocation.latitude},${pickedLocation.longitude}&key=${mapsApiKey}`;
  };

  return (
    <View style={styles.container}>
      <Button title="Find My Location" onPress={locateUserHandler} />

      {pickedLocation && (
        <>
          <Image
            style={styles.mapPreview}
            source={{ uri: getMapPreview()! }}
          />
          <Button
            title="Save Location"
            onPress={saveLocationHandler}
          />
        </>
      )}

      <Button
        title="Open Interactive Map"
        onPress={() => {
          if (pickedLocation) {
            const { latitude, longitude } = pickedLocation;
            router.push(`/map?lat=${latitude}&lng=${longitude}`);
          } else {
            router.push('/map');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    gap: 10,
  },
  mapPreview: {
    width: 350,
    height: 180,
    marginVertical: 10,
    borderRadius: 10,
  },
});