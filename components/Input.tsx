import React, { useState } from 'react';
import { Modal, Button, StyleSheet, TextInput, View, Text, Alert } from 'react-native';

interface InputProps {
  modalVisible: boolean;
  textInputFocus: boolean;
  inputHandler: (text: string) => void;
  onCancel: () => void;  // New prop for handling cancel
}

export default function Input({ modalVisible, textInputFocus, inputHandler, onCancel }: InputProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    inputHandler(inputText);
    setInputText('');
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel",
      "Are you sure you want to cancel?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            setInputText('');  // Clear the input
            onCancel();  // Call the callback to close modal
          }
        }
      ]
    );
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Enter Your Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your goal..."
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            autoFocus={textInputFocus}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="Cancel" onPress={handleCancel} color="red" />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Confirm" onPress={handleSubmit} />
            </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',  
    width: '100%',
    gap: 20,
  },
  buttonWrapper: {
    flex:1,
    width: '45%',
  },
});