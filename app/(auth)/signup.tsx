import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Signup() {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/protected/goals"); // Redirect after successful signup
    } catch (error) {
      console.error("Signup failed:", error.message);
    }
  };

  return (
    <View>
      <Text>Email Address</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Text>Confirm Password</Text>
      <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <Button title="Register" onPress={handleSignup} />
      <Text onPress={() => router.push("/auth/login")}>
        Already Registered? Login
      </Text>
    </View>
  );
}