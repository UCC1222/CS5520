import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

export default function Input() {
  const [inputText, setInputText] = useState(''); // State for TextInput

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type something..."
        value={inputText} // Controlled by state
        onChangeText={(text) => setInputText(text)} // Updates state
      />
      <Button title="Submit" onPress={() => console.log(inputText)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});