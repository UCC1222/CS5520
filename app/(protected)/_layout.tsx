import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import Ionicons for icons
import { getAuth, signOut } from "firebase/auth"; // ✅ Import signOut function

export default function ProtectedLayout() {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login"); // Redirect to login screen after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#6200ea" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      {/* Home Screen (index.tsx) with Profile Icon */}
      <Stack.Screen
        name="index"
        options={{
          title: "All My Goals",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/(protected)/profile")} style={{ marginRight: 15 }}>
              <Ionicons name="person-circle-outline" size={28} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Profile Screen with Logout Icon */}
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}