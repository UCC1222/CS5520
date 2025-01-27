import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface Goal {
  text: string;
  id: number;
}

interface GoalItemProps {
  goal: Goal;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  return (
    <View style={styles.goalItem}>
      <Text>{goal.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  goalItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
    width: '90%', // Ensure consistent width
  },
});

export default GoalItem;