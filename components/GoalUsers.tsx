import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { writeToSubcollection, getUsersFromFirestore } from '../Firebase/firestoreHelper';
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
        // ✅ 1. First, check Firestore for existing users
        const storedUsers = await getUsersFromFirestore(goalId);

        if (storedUsers.length > 0) {
          console.log(`Using existing users from Firestore for goal: ${goalId}`);
          setUsers(storedUsers);
          return; // ✅ Skip API call since users already exist
        }

        // ✅ 2. If no users in Firestore, fetch from API
        console.log(`Fetching users from API for goal: ${goalId}`);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }
        const apiUsers = await response.json();

        // ✅ 3. Write API data to Firestore under "goals/${goalId}/users"
        for (const user of apiUsers) {
          await writeToSubcollection(`goals/${goalId}/users`, {
            name: user.name,
          });
        }

        // ✅ 4. Fetch Saved Users from Firestore after writing
        const finalUsers = await getUsersFromFirestore(goalId);
        setUsers(finalUsers);
      } catch (err) {
        setError('Failed to fetch and store users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [goalId]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users for Goal: {goalId}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.user}>{item.name}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  user: { fontSize: 16, paddingVertical: 5 },
  error: { color: 'red', fontSize: 16 },
});

export default GoalUsers;