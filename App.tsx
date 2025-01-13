import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from './components/Header';
import Input from './components/Input';

export default function App() {
  const appName = "CC's APP";

  return (
    <View style={styles.container}>
      <Header appName={appName} />
      <Input /> {/* Render the Input component */}
      {/* <Text>You typed: {text}</Text> */} {/* Commented out as per instructions */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});