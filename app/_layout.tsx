import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";

export default function Layout() {
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments(); // Get the current route segments

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user); // Convert user object to boolean (true/false)
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userLoggedIn === null) return; // Don't navigate until auth state is known

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";

    if (userLoggedIn && inAuthGroup) {
      router.replace("/(protected)"); // Redirect logged-in users to protected pages
    } else if (!userLoggedIn && inProtectedGroup) {
      router.replace("/(auth)/login"); // Redirect logged-out users to login page
    }
  }, [userLoggedIn, segments]);

  if (userLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="(auth)" options={{ animation: "slide_from_left" }} />
      <Stack.Screen name="(protected)" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}