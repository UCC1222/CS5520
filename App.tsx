import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, FlatList, Alert } from 'react-native';
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
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <GoalItem goal={item} deleteGoal={deleteGoal}/>}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
          ListHeaderComponent={
            goals.length > 0 ? (
              <View style={styles.headerContainer}>
                <Text style={styles.listHeaderText}>My Goals</Text>
              </View>
            ) : null
          }

          ListFooterComponent={
            goals.length > 0 ? (
              <View style={styles.footerContainer}>
                <Button
                  title="Delete All"
                  color="blue"
                  onPress={() =>{
                    Alert.alert(
                      'Delete All Goals',
                      'Are you sure you want to delete all goals?',
                      [
                        {
                          text: 'No',
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => setGoals([]),
                          style: 'destructive',
                        },
                      ]
                    )
                  }}
                />
              </View>
            ) : null
          }

          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No goals to show</Text>
            </View>
          }
          contentContainerStyle={{ 
            paddingVertical: 10,}} // Style for container
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
  },
  headerContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  listHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'purple',
  },
  footerContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'purple',
    marginVertical: 8,
    alignSelf: 'center',
  }
});