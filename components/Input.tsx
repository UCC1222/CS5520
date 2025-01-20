import React, { useState } from 'react';
import { Modal, Button, StyleSheet, TextInput, View } from 'react-native';

// Define the props interface
interface InputProps {
  modalVisible: boolean; // Boolean to control visibility
  textInputFocus: boolean; // Boolean to control focus
  inputHandler: (text: string) => void; // Callback to handle input text
}

export default function Input({ modalVisible, textInputFocus, inputHandler }: InputProps) {
  const [inputText, setInputText] = useState(''); // State for TextInput


  // Function to handle the Submit button press
  const handleSubmit = () => {
    inputHandler(inputText); // Call the callback function with input text
    setInputText(''); // Clear the input field
  };

  return (
    <Modal visible={modalVisible} animationType="slide">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          value={inputText} // Controlled by state
          onChangeText={(text) => setInputText(text)} // Update state on input change
          autoFocus={textInputFocus} // Set focus if textInputFocus is true
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </Modal>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});