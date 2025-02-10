import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ea' }, 
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: "Home" }} 
      />

      <Stack.Screen 
        name="goals/[id]" 
        options={{ title: "Goal Details" }} 
      />
    </Stack>
  );
}