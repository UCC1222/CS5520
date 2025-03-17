import React from 'react';
import { Text, StyleSheet, View, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import Goal from '../App';
import PressableButton from './PressableButton';
import { Ionicons } from '@expo/vector-icons';

export interface Goal {
  text: string;
  id: string;
  owner: string;
}

export interface GoalItemProps {
  goal: Goal;
  deleteGoal: (id: string) => void;
  onPressIn?: () => void;
  onPressOut?: () => void;

}

const GoalItem: React.FC<GoalItemProps> = ({ 
  goal, deleteGoal, onPressIn, onPressOut }) => {
    const handleLongPress = () => {
      Alert.alert(
        "Delete Goal",
        `Are you sure you want to delete "${goal.text}"?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "Delte", onPress: () => deleteGoal(goal.id),
            style: "destructive"}
        ]
      );
    };
  
  return (
      <Pressable style={({pressed}) => [styles.goalItem, pressed && styles.pressed]}
        onPress={() => router.push(`/goals/${goal.id}`)}
        onLongPress={handleLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        android_ripple={{ 
          color: '#210644', 
          borderless: false,
          foreground: true 
        }}>

        <Text style={styles.goalText}>{goal.text}</Text>
        <PressableButton onPress={() => deleteGoal(goal.id)}
        style={styles.deleteButton}>
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
    goalText: {
      fontSize: 16,
    },
    pressed:{
      opacity: 0.7,
      backgroundColor: '#e0b3ff',
    },
    deleteButton: {
      backgroundColor: 'grey',
      minWidth: 40,
      alignItems: 'center',
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
    }
  });

export default GoalItem;