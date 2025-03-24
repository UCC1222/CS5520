// app/(protected)/map.tsx
import { View, StyleSheet, Button, Pressable, Text } from 'react-native';
import MapView, { Marker, Region, MapPressEvent } from 'react-native-maps';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';

export default function MapScreen() {
  const { lat, lng } = useLocalSearchParams<{ lat?: string; lng?: string }>();

  const initialRegion: Region = {
    latitude: lat ? parseFloat(lat) : 37.773972,
    longitude: lng ? parseFloat(lng) : -122.431297,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      router.push({
        pathname: '/profile',
        params: {
          lat: selectedLocation.latitude.toString(),
          lng: selectedLocation.longitude.toString(),
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            pinColor="red"
          />
        )}
      </MapView>

      {/* Confirm button */}
      <Pressable
        style={[
          styles.button,
          !selectedLocation && styles.buttonDisabled
        ]}
        onPress={handleConfirm}
        disabled={!selectedLocation}
      >
        <Text style={[
          styles.buttonText,
          !selectedLocation && styles.buttonTextDisabled
        ]}>
          Confirm Selected Location
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    button: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      paddingVertical: 14,
      backgroundColor: 'transparent',
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    buttonText: {
      color: 'blue',
      fontWeight: '600',
      fontSize: 16,
    },
    buttonTextDisabled: {
      color: '#999',
    },
  });