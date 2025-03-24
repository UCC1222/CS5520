// /app/goals/[id].tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';

import { readDocFromDB, updateDB } from '../../../Firebase/firestoreHelper';
import { storage } from '../../../Firebase/firebaseSetup';
import PressableButton from '../../../components/PressableButton';
import GoalUsers from '../../../components/GoalUsers';

export default function GoalDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [goalText, setGoalText] = useState<string | null>(null);
  const [warning, setWarning] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docData = await readDocFromDB(id, 'goals');
        if (docData) {
          setGoalText(docData.text);
          setWarning(docData.warning || false);
          setImageUri(docData.imageUri || null);
        }
      } catch (err) {
        console.log("❌ Error fetching goal:", err);
        Alert.alert("Error", "Unable to load goal.");
      }
    };

    fetchGoal();
  }, [id]);

  useEffect(() => {
    const fetchImage = async () => {
      if (imageUri) {
        setLoadingImage(true);
        try {
          const ref = storageRef(storage, imageUri);
          const url = await getDownloadURL(ref);
          setImageUrl(url);
        } catch (err) {
          console.error("❌ Error fetching image:", err);
        } finally {
          setLoadingImage(false);
        }
      }
    };

    fetchImage();
  }, [imageUri]);

  const toggleWarning = async () => {
    const newWarning = !warning;
    setWarning(newWarning);
    try {
      await updateDB(id, 'goals', { warning: newWarning });
    } catch (err) {
      console.error("❌ Failed to update warning:", err);
    }
  };

  return (
    <View style={[styles.container, warning && styles.warningBackground]}>
      <Stack.Screen
        options={{
          headerTitle: warning ? "⚠️ Warning!" : goalText || "Goal Details",
          headerRight: () => (
            <PressableButton onPress={toggleWarning} style={styles.warningButton}>
              <Ionicons name="warning-outline" size={24} color="black" />
            </PressableButton>
          ),
        }}
      />

      <Text style={[styles.goalText, warning && styles.warningText]}>
        {goalText || "Loading..."}
      </Text>

      {loadingImage && <ActivityIndicator size="large" color="purple" />}

      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.goalImage} />
      )}

      {!imageUrl && !loadingImage && (
        <Text style={styles.noImageText}>No image attached to this goal.</Text>
      )}

      <GoalUsers goalId={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  warningBackground: {
    backgroundColor: '#ffe6e6',
  },
  goalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  warningText: {
    color: 'red',
  },
  goalImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginVertical: 15,
  },
  noImageText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
  },
  warningButton: {
    marginRight: 10,
    backgroundColor: 'white',
  },
});