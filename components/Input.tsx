import React, { useState } from 'react';
import { Modal, Button, StyleSheet, TextInput, View, Text } from 'react-native';

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
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        {/* Inner box with rounded corners */}
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Enter Your Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your goal..."
            value={inputText} // Controlled by state
            onChangeText={(text) => setInputText(text)} // Update state on input change
            autoFocus={textInputFocus} // Set focus if textInputFocus is true
          />
          <View style={styles.buttonContainer}>
            <Button title="Confirm" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Transparent background for Modal
  },
  innerContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '30%',
    marginTop: 10,
  },
});