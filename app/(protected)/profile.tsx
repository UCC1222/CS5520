import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, Button } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useLocalSearchParams, router } from 'expo-router';
import Constants from 'expo-constants';

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;

  const { lat, lng } = useLocalSearchParams<{ lat?: string; lng?: string }>();
  const [pickedLocation, setPickedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Set picked location from query params
  useEffect(() => {
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      setPickedLocation({ latitude, longitude });
    }
  }, [lat, lng]);

  const getMapPreview = () => {
    if (!pickedLocation) return null;

    const mapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const { latitude, longitude } = pickedLocation;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${latitude},${longitude}&key=${mapsApiKey}`;
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
          title="Pick a Location"
          onPress={() => router.push('/map')}
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