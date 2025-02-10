import { View, Text, Button, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { readDocFromDB, updateDB} from '../../Firebase/firestoreHelper';

export default function GoalDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [goalText, setGoalText] = useState<string | null>(null);
  const [warning, setWarning] = useState(false);    

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docData = await readDocFromDB(id, 'goals');
        if (docData) {
          setGoalText(docData.text); 
          setWarning(docData.warning || false);
        }
      } catch (err) {
        console.log("Error fetching goal:", err);
      }
    };
    fetchGoal();
  }, [id]);
  const toggleWarning = async () => {
    const newWarning = !warning;
    setWarning(newWarning);
    await updateDB(id, 'goals', { warning: newWarning });
  };

  return (
    <View style={[styles.container, warning && styles.warningBackground]}>
      {/* ✅ Proper placement of Stack.Screen to dynamically update title */}
      <Stack.Screen options={{
        headerTitle: warning ? "Warning!" : goalText || "Goal Details",
        headerRight: () => (
          <Button title="Warning" color="red" onPress={toggleWarning} />
        )
      }} />
      
      {/* ✅ Goal text changes color dynamically */}
      <Text style={[styles.goalText, warning && styles.warningText]}>
        {goalText ? goalText : "Loading..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningBackground: {
    backgroundColor: '#ffe6e6',
  },
  goalText: {
    fontSize: 18,
  },
  warningText: {
    color: 'red',
  },
});