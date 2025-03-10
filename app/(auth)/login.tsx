import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // ✅ Import Firebase functions
import { auth } from "../../Firebase/firebaseSetup"; // ✅ Import the auth instance

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Prevent multiple requests

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      Alert.alert("Success", "Login successful!");

      // ✅ No manual navigation needed, app layout handles redirection
    } catch (error) {
      console.error("Login failed:", error.message);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email Address</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />

      <Button title={loading ? "Logging In..." : "Log In"} onPress={handleLogin} disabled={loading} />

      <Text onPress={() => router.push("/signup")} style={{ marginTop: 10, color: "blue" }}>
        New User? Create an account
      </Text>
    </View>
  );
}