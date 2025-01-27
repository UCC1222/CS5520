 
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button } from 'react-native';
import Input from './components/Input';

export interface Goal {
  text: string;
  id: number;
}

export default function App() {
  const [text, setText] = useState('Study');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  
  const handleInputData = (input: string) => {
    const newGoal: Goal = {
      text: input,
      id: Math.random(),
    };
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header and Button Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerText}>Welcome to My awesome app</Text>
        <Button title="ADD A GOAL" onPress={() => setIsModalVisible(true)} />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.bottomText}>{text}</Text>
      </View>
      <Input
        modalVisible={isModalVisible}
        textInputFocus={true}
        inputHandler={handleInputData}
        onCancel={handleCancel}
      />
    </SafeAreaView>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 10,
  },

  bottomSection: {
    flex: 4,
    backgroundColor: '#d8bfd8', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 16,
    color: 'blue',
 
  },
});