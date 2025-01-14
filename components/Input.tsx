import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

export default function Input({ autoFocus }: { autoFocus: boolean }) {
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Type something..."
        value={inputText}
        onChangeText={(text) => setInputText(text)}
      />
      {inputText.length > 0 && (
        <Text style={styles.counter}>Character count: {inputText.length}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
});