import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { getUsersFromFirestore } from '../Firebase/firestoreHelper';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../Firebase/firebaseSetup';

interface GoalUsersProps {
  goalId: string;
}

interface User {
  id: string;
  name: string;
}

const GoalUsers: React.FC<GoalUsersProps> = ({ goalId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUsers = await getUsersFromFirestore(goalId);

        if (storedUsers.length > 0) {
          console.log(`Using existing users from Firestore for goal: ${goalId}`);
          setUsers(storedUsers);
          return;
        }

        console.log(`Fetching users from API for goal: ${goalId}`);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }
        const apiUsers = await response.json();
        setUsers(apiUsers);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [goalId]);

  const postUser = async (userName: string) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName }),
      });

      const responseData = await response.json();
      console.log('User added:', responseData);
      alert(`User added: ${responseData.name}`);
    } catch (err) {
      console.error('Error posting user:', err);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users for Goal: {goalId}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.user}>{item.name}</Text>
            <Pressable
              style={styles.postButton}
              onPress={() => postUser(item.name)}
            >
              <Text style={styles.buttonText}>POST</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  userContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  user: { fontSize: 16, paddingVertical: 5 },
  postButton: { backgroundColor: 'blue', padding: 8, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  error: { color: 'red', fontSize: 16 },
});

export default GoalUsers;