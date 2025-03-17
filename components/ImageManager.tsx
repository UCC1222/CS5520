import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageManager = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 🔹 Use the permission hook
  const [permissionResponse, requestPermission] = ImagePicker.useCameraPermissions();

  const takeImageHandler = async () => {
    // 🔹 Check if permission is granted
    if (!permissionResponse?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'You need to grant camera access to use this feature.');
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while taking the picture.');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Picture" onPress={takeImageHandler} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default ImageManager;