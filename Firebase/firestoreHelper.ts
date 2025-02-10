import { collection, addDoc, deleteDoc, doc, getDocs, getDoc, updateDoc} from 'firebase/firestore';
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
export async function writeToDB(data: Omit<Goal, 'id'>, collectionName: string): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(database, collectionName), data);
    console.log(`Document added successfully with ID: ${docRef.id}`);
    return docRef.id; // Return the ID of the newly added document
  } catch (err) {
    console.error('Error adding document:', err);
    return null; // Return null if an error occurs
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