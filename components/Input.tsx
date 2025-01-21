import React, { useState, useMemo } from 'react';
import { Modal, Button, StyleSheet, TextInput, View, Text, Alert } from 'react-native';

interface InputProps {
  modalVisible: boolean;
  textInputFocus: boolean;
  inputHandler: (text: string) => void;
  onCancel: () => void;
  minLength?: number; // Optional prop for minimum length requirement
}

export default function Input({ 
  modalVisible, 
  textInputFocus, 
  inputHandler, 
  onCancel,
  minLength = 3 // Default minimum length of 3 characters
}: InputProps) {
  const [inputText, setInputText] = useState('');

  // Compute if the input is valid using useMemo to optimize performance
  const isInputValid = useMemo(() => {
    return inputText.trim().length >= minLength;
  }, [inputText, minLength]);

  const handleSubmit = () => {
    if (isInputValid) {
      inputHandler(inputText);
      setInputText('');
    }
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
            setInputText('');
            onCancel();
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
            placeholder={`Type your goal (min ${minLength} characters)...`}
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            autoFocus={textInputFocus}
          />
          {/* Helper text to show minimum length requirement */}
          <Text style={[
            styles.helperText,
            { color: isInputValid ? 'green' : 'red' }
          ]}>
            {isInputValid 
              ? '✓ Valid input'
              : `${minLength - inputText.trim().length} more characters needed`
            }
          </Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button 
                title="Cancel" 
                onPress={handleCancel} 
                color="red" 
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button 
                title="Confirm" 
                onPress={handleSubmit}
                disabled={!isInputValid}
                color={isInputValid ? undefined : '#cccccc'}
              />
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
    marginBottom: 8, // Reduced to make room for helper text
  },
  helperText: {
    fontSize: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  buttonWrapper: {
    flex: 1,
    maxWidth: '45%',
  },
});