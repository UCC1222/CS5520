import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebaseSetup';
import { getAuth } from "firebase/auth"; // ✅ Import Firebase Auth

const uploadImageToFirebase = async (uri: string) => {
  try {
    const auth = getAuth(); // ✅ Get authentication instance
    const user = auth.currentUser; // ✅ Get the currently logged-in user
    if (!user) throw new Error("❌ User not authenticated.");

    const response = await fetch(uri);
    const blob = await response.blob();
    
    // ✅ Store images inside the user's folder: `/images/{userId}/filename.jpg`
    const fileName = `images/${user.uid}/${Date.now()}.jpg`;
    const imageRef = ref(storage, fileName);

    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);

    console.log("✅ Image uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return null;
  }
};

const ImageManager = ({ onImageTaken }: { onImageTaken: (uri: string) => void }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 🔹 Use the permission hook
  const [permissionResponse, requestPermission] = ImagePicker.useCameraPermissions();

  const takeImageHandler = async () => {
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

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        const downloadURL = await uploadImageToFirebase(uri);
        if (downloadURL) {
          onImageTaken(downloadURL); // ✅ Pass the Firebase Storage URL to Input.tsx
        }
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