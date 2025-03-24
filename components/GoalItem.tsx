import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Pressable, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import PressableButton from './PressableButton';
import { Ionicons } from '@expo/vector-icons';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage } from '../Firebase/firebaseSetup';

export interface Goal {
  text: string;
  id: string;
  owner: string;
  imageUri?: string | null;
}

export interface GoalItemProps {
  goal: Goal;
  deleteGoal: (id: string) => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, deleteGoal, onPressIn, onPressOut }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (goal.imageUri) {
        try {
          const downloadURL = await getDownloadURL(storageRef(storage, goal.imageUri));
          setImageUrl(downloadURL);
        } catch (error) {
          console.error("Failed to load image from Firebase Storage:", error);
        }
      }
    };

    fetchImage();
  }, [goal.imageUri]);

  const handleLongPress = () => {
    Alert.alert(
      "Delete Goal",
      `Are you sure you want to delete "${goal.text}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteGoal(goal.id), style: "destructive" }
      ]
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.goalItem, pressed && styles.pressed]}
      onPress={() => router.push(`/goals/${goal.id}`)}
      onLongPress={handleLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      android_ripple={{ color: '#210644', borderless: false, foreground: true }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.goalText}>{goal.text}</Text>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.goalImage} />}
      </View>

      <PressableButton onPress={() => deleteGoal(goal.id)} style={styles.deleteButton}>
        <Ionicons name="trash" size={18} color="white" />
      </PressableButton>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: 8,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  goalImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: '#e0b3ff',
  },
  deleteButton: {
    backgroundColor: 'grey',
    minWidth: 40,
    alignItems: 'center',
  },
});

export default GoalItem;