import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#8844ee" },
        headerTintColor: "#fff",
      }}
    />
  );
}