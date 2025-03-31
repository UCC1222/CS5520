import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, FlatList, Alert, Platform } from 'react-native';
import Input from '../../components/Input';
import GoalItem from '../../components/GoalItem';
import { Goal } from '../../components/GoalItem';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { database, auth, storage } from '../../Firebase/firebaseSetup';
import { writeToFirestore, deleteFromDB, deleteAllFromDB } from '../../Firebase/firestoreHelper';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { verifyPermission } from '../../components/NotificationManager';

// Set up the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  // Configure Android notification channel
  useEffect(() => {
    const configureNotifications = async () => {
      try {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
          console.log('No permission for notifications');
          return;
        }

        // Configure Android channel
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
          });
        }
      } catch (error) {
        console.error('Error configuring notifications:', error);
      }
    };

    configureNotifications();
  }, []);

  // Notification received listener
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        const { title, body } = notification.request.content;
        Alert.alert(title || 'New Notification', body);
      }
    );

    return () => subscription.remove();
  }, []);

  // Notification response listener
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        const { data } = response.notification.request.content;
        
        // Handle navigation based on the data passed in notification
        if (data?.screen === 'profile') {
          router.push('/profile');
        }
      }
    );

    return () => subscription.remove();
  }, [router]);

  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert("Error", "User is not authenticated");
      return;
    }

    const goalsQuery = query(collection(database, 'goals'), where("owner", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(goalsQuery, 
      (querySnapshot) => {
        const goalsData: Goal[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          goalsData.push({ 
            id: doc.id, 
            text: data.text,
            owner: data.owner,
            imageUri: data.imageUri || null
          });
        });
        setGoals(goalsData);
      },
      (error) => {
        Alert.alert("Permission Error", "You do not have permission to access this data.");
        console.error("Error fetching goals:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleInputData = async ({ text, imageUri }: { text: string; imageUri: string | null }) => {
    if (!auth.currentUser) {
      Alert.alert("Error", "User is not authenticated");
      return;
    }
  
    let uploadedImagePath:string |null = null;
    
    // If imageUri exists, upload it to Firebase Storage
    if (imageUri) {
      try {
        // Fetch the image data from the URI
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        // Create a reference to the user's images folder in Firebase Storage
        const fileName = `images/${auth.currentUser.uid}/${Date.now()}.jpg`;
        const imageRef = ref(storage, fileName);

        console.log("Uploading image to Firebase Storage:", fileName);
        
        // Upload the image using uploadBytes (simpler than uploadBytesResumable)
        await uploadBytes(imageRef, blob);
        
        // Store the path to the uploaded image (we'll use this to fetch it later)
        uploadedImagePath = fileName;
      } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
        Alert.alert("Error", "Failed to upload image. Please try again.");
        return;
      }
    }
  
    const newGoal = {
      text,
      imageUri: uploadedImagePath, // Store the Firebase Storage path
      id: Math.random().toString(),
      owner: auth.currentUser.uid,
    };

    console.log("New Goal:", newGoal);
  
    try {
      await writeToFirestore("goals", newGoal);
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add goal. Please try again.");
      console.error("Error adding goal to Firestore:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteGoal = async (id: string) => {
    try{
      await deleteFromDB(id, 'goals');
    } catch (error) {
      Alert.alert("Error", "Failed to delete goal. Please try again.");
      console.error("Error deleting goal from Firestore:", error);
    }
  };

  const deleteAllGoals = async () => {
    try{
      await deleteAllFromDB('goals');
    } catch (error) {
      Alert.alert("Error", "Failed to delete all goals. Please try again.");
      console.error("Error deleting all goals from Firestore:", error);
    }
  };

  const renderSeparator = ({highlighted}: {highlighted: boolean}) => (
    <View
      style={[
        styles.separator,
        {
          backgroundColor: highlighted ? '#800080' : '#d3d3d3', // 默认浅灰色，高亮时紫色
          height: highlighted ? 8 : 5,
          width: '90%',
        }
      ]}
    />
  );

  const renderItem = ({item, separators
  }: {item: Goal;
     separators: {
      highlight: () => void;
      unhighlight: () => void;
     }}) => (
      <GoalItem
        goal={item}
        deleteGoal={deleteGoal}
        onPressIn={() => separators.highlight()}
        onPressOut={() => separators.unhighlight()}
      />
     );
  
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
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
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
                  onPress={deleteAllGoals}
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
    width: '90%',
    marginVertical: 8,
    alignSelf: 'center',
    height: 10,
  }
});