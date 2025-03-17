// Import the functions you need from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage"; // ✅ Import Firebase Storage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnjqD2YD3gVV_t6nIfnQ6lIsWgte3u64s",
  authDomain: "cc5520.firebaseapp.com",
  projectId: "cc5520",
  storageBucket: "cc5520.appspot.com", // ✅ Corrected storageBucket (must end with .appspot.com)
  messagingSenderId: "909431427445",
  appId: "1:909431427445:web:a8b96345a80c2184ed433c"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const storage = getStorage(app); // ✅ Ensure Firebase Storage is initialized & exported