import React, { useState } from 'react';
import { Modal, Button, StyleSheet, TextInput, View, Text, Alert, Image } from 'react-native';
import ImageManager from './ImageManager'; // Import ImageManager component

interface InputProps {
  modalVisible: boolean;
  textInputFocus: boolean;
  inputHandler: (data: { text: string; imageUri: string | null }) => void;
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
  const [imageUri, setImageUri] = useState<string | null>(null);

  const isInputValid = inputText.trim().length >= minLength;

  const handleSubmit = () => {
    if (isInputValid) {
      inputHandler({ text: inputText, imageUri }); // ✅ Pass text and imageUri to index.tsx
      setInputText('');
      setImageUri(imageUri);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Enter Your Goal</Text>

          {/* 🔹 ImageManager component to capture image */}
          <ImageManager onImageTaken={setImageUri} />

          {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

          <TextInput
            style={styles.input}
            placeholder={`Type your goal (min ${minLength} characters)...`}
            value={inputText}
            onChangeText={setInputText}
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
            <Button title="Cancel" onPress={onCancel} color="red" />
            <Button title="Confirm" onPress={handleSubmit} disabled={!isInputValid} />
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  innerContainer: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 15, 
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10, 
  },
  imagePreview: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginBottom: -150, 
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 6, 
  },
  helperText: {
    fontSize: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});