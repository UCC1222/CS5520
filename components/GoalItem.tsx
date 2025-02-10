import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';
import Goal from '../App';

export interface Goal {
  text: string;
  id: string;
}

export interface GoalItemProps {
  goal: Goal;
  deleteGoal: (id: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, deleteGoal }) => {
    return (
      <View style={styles.goalItem}>
        <Link href={`/goals/${goal.id}`} asChild>
          <Text style={styles.linkText}>info</Text>
        </Link>
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
    linkText: {
      fontSize: 16,
      color: 'blue',
      marginRight: 10,
      textDecorationLine: 'underline',
    },
  });

export default GoalItem;