import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ea' }, 
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push("/(protected)/profile")} style={{ marginRight: 15 }}>
            <Ionicons name="person-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: "All My Goals" }} 
      />

<Stack.Screen 
        name="goals/[id]" 
        options={{ 
          title: "Goal Details",
          headerBackTitle: "All My Goals", 
        }} 
      />
    </Stack>
  );
}