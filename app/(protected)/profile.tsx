import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, Button } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useLocalSearchParams, router } from 'expo-router';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;

  const { lat, lng } = useLocalSearchParams<{ lat?: string; lng?: string }>();
  const [pickedLocation, setPickedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [permissionResponse, requestPermission] = Location.useForegroundPermissions();

  // Set picked location from query params
  useEffect(() => {
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      setPickedLocation({ latitude, longitude });
    }
  }, [lat, lng]);

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

  const getMapPreview = () => {
    if (!pickedLocation) return null;

    const mapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const { latitude, longitude } = pickedLocation;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${latitude},${longitude}&key=${mapsApiKey}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>

      {user ? (
        <>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Text style={styles.info}>UID: {user.uid}</Text>
        </>
      ) : (
        <Text style={styles.info}>No user is logged in</Text>
      )}

      <View style={styles.locationSection}>
        <Button
          title="Find My Location"
          onPress={locateUserHandler}
        />

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

        {pickedLocation && (
          <Image
            source={{ uri: getMapPreview()! }}
            style={styles.mapPreview}
          />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  locationSection: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
  },
  mapPreview: {
    width: 350,
    height: 180,
    borderRadius: 10,
    marginTop: 15,
  },
});