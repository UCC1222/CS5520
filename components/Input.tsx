import React, { useState } from 'react';
import { Modal, Button, StyleSheet, TextInput, View, Text, Alert, Image } from 'react-native';

interface InputProps {
  modalVisible: boolean;
  textInputFocus: boolean;
  inputHandler: (text: string) => void;
  onCancel: () => void;
  minLength?: number;
}

export default function Input({ 
  modalVisible, 
  textInputFocus, 
  inputHandler, 
  onCancel,
  minLength = 3 
}: InputProps) {
  const [inputText, setInputText] = useState('');
  
  const isInputValid = inputText.trim().length >= minLength;

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
          
          {/* Image container */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2617/2617812.png' }}
              style={styles.image}
              accessibilityLabel="Target icon from network"
            />
            <Image 
              source={require('../assets/target-icon.png')}  // Assuming you saved the image as target-icon.png in assets folder
              style={styles.image}
              accessibilityLabel="Target icon from local assets"
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder={`Type your goal (min ${minLength} characters)...`}
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            autoFocus={textInputFocus}
          />
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
  imageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 8,
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