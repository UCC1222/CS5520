import { View, Text, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>User Profile</Text>
      {user ? (
        <>
          <Text>Email: {user.email}</Text>
          <Text>UID: {user.uid}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>No user is logged in</Text>
      )}
    </View>
  );
}