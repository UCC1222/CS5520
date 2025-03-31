import { collection, addDoc, deleteDoc, doc, getDocs, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { database } from './firebaseSetup';

export interface Goal {
  id: string;
  text: string;
}

export async function updateDB(id: string, collectionName: string, data: object) {
  try {
    const docRef = doc(database, collectionName, id);
    await updateDoc(docRef, data);
    console.log(`Updated document ${id} in ${collectionName}`);
  } catch (err) {
    console.error("Error updating document:", err);
  }
}

// Add a document to Firestore and return its ID
export async function writeToFirestore(
  path: string, 
  data: object
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(database, path), data);
    console.log(`Document added successfully in ${path} with ID: ${docRef.id}`);
    return docRef.id;
  } catch (err) {
    console.error(`Error adding document to ${path}:`, err);
    return null;
  }
}

// Delete a document by ID
export async function deleteFromDB(id: string, collectionName: string): Promise<boolean> {
  try {
    await deleteDoc(doc(database, collectionName, id));
    console.log(`Document with ID: ${id} deleted successfully.`);
    return true; // Return success
  } catch (err) {
    console.error(`Error deleting document with ID: ${id}`, err);
    return false; // Return failure
  }
}

// Delete all documents from a collection (optimized for parallel deletion)
export async function deleteAllFromDB(collectionName: string): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(database, collectionName));
    const deletePromises: Promise<void>[] = []; // Array to hold all delete promises

    querySnapshot.forEach((docSnap) => {
      deletePromises.push(deleteDoc(doc(database, collectionName, docSnap.id)));
    });

    await Promise.all(deletePromises); // Wait for all delete operations to complete
    console.log('All documents deleted successfully.');
  } catch (err) {
    console.error('Error deleting all documents:', err);
  }
}

export async function readAllFromDB(collectionName: string) {
  const querySnapshot = await getDocs(collection(database, collectionName));
}

export async function readDocFromDB(id: string, collectionName: string) {
  try {
    const docRef = doc(database, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error("Error fetching document:", err);
    return null;
  }
}

export async function getUsersForGoal(goalId: string) {
  try {
    const usersRef = collection(database, `goals/${goalId}/users`);
    const querySnapshot = await getDocs(usersRef);

    const usersList = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    console.log(`Fetched ${usersList.length} users for goal: ${goalId}`);
    return usersList;
  } catch (err) {
    console.error(`Error fetching users for goal ${goalId}:`, err);
    return [];
  }
}


export async function getUsersFromFirestore(goalId: string) {
  try {
    const usersRef = collection(database, `goals/${goalId}/users`);
    const querySnapshot = await getDocs(usersRef);

    const usersList = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      name: docSnap.data().name || "Unnamed User", // Ensure name exists
    }));

    return usersList;
  } catch (err) {
    console.error(`Error fetching users for goal ${goalId}:`, err);
    return [];
  }
}

export const saveUserLocation = async (latitude: number, longitude: number, userId: string) => {
  const userRef = doc(database, 'users', userId);
  
  try {
    await setDoc(userRef, {
      location: {
        latitude,
        longitude,
      }
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving user location:', error);
    throw error;
  }
};

export const getUserLocation = async (userId: string) => {
  try {
    const userRef = doc(database, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().location) {
      return userDoc.data().location;
    }
    return null;
  } catch (error) {
    console.error('Error getting user location:', error);
    throw error;
  }
};