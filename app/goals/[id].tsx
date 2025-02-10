import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { readDocFromDB } from '../../Firebase/firestoreHelper';

export default function GoalDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [goalText, setGoalText] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docData = await readDocFromDB(id, 'goals');
        if (docData) {
          setGoalText(docData.text); 
        }
      } catch (err) {
        console.log("Error fetching goal:", err);
      }
    };
    fetchGoal();
  }, [id]);
  return (
    <View>
      <Text>Goal Details</Text>
      <Text>{goalText ? goalText : "Loading..."}</Text> 
    </View>
  );
}