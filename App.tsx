import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button } from 'react-native';
import Header from './components/Header';
import Input from './components/Input';

export default function App() {
  const appName = "CC's APP";
  const [text, setText] = useState(''); // State to store the input data
  const [isModalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  // Callback function to handle the input text
  function handleInputData(input: string): void {
    setText(input); // Update the state with the received input
    setModalVisible(false); // Close the modal
  }

  return (
    <View style={styles.container}>
      <Button title="Add a goal" onPress={() => setModalVisible(true)} />
      <Header appName={appName} />
      {/* Pass props to Input */}
      <Input textInputFocus={true} inputHandler={handleInputData} modalVisible={isModalVisible}/>
      {/* Uncomment Text to display the input */}
      <Text>You typed: {text}</Text>
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