import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, FlatList } from 'react-native';
import Input from './components/Input';
import GoalItem, { Goal } from './components/GoalItem';

export default function App() {
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
  };

  const deleteGoal = (id: number) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header and Button Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerText}>Welcome to My awesome app</Text>
        <Button title="ADD A GOAL" onPress={() => setIsModalVisible(true)} />
      </View>

      {/* Goals List */}
      <View style={styles.bottomSection}>
        <FlatList
          data={goals} // Array of items to render
          keyExtractor={(item) => item.id.toString()} // Unique key for each item
          renderItem={({ item }) => <GoalItem goal={item} deleteGoal={deleteGoal}/>} // Render GoalItem
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No goals to show</Text>
            </View>
          }
          contentContainerStyle={{ alignItems: 'center' }} // Style for container
          style={{ flex: 1 }}
        />
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
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'purple',
    marginTop: 20,
  }
});