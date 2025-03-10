import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Login() {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/protected/goals"); // Redirect to protected page
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <View>
      <Text>Email Address</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Log In" onPress={handleLogin} />
      <Text onPress={() => router.push("/auth/signup")}>
        New User? Create an account
      </Text>
    </View>
  );
}