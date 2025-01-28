import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Goal from '../App';

export interface Goal {
  text: string;
  id: number;
}

interface GoalItemProps {
  goal: Goal;
  deleteGoal: (id: number) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, deleteGoal }) => {
    return (
      <View style={styles.goalItem}>
        <Text style={styles.goalText}>{goal.text}</Text>
        <Button title="X" color="red" onPress={() => deleteGoal(goal.id)} />
      </View>
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
  });

export default GoalItem;