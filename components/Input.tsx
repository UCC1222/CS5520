import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

export default function Input({ autoFocus }: { autoFocus: boolean }) {
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

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
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
      />
      {hasFocus && inputText.length > 0 && (
        <Text style={styles.counter}>Character count: {inputText.length}</Text>
      )}
      {!hasFocus && inputText.length > 0 && (
        <Text style={styles.message}>
          {inputText.length >= 3
            ? 'Thank you'
            : 'Please type more than 3 characters'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 10,
      width: '100%',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    counter: {
      fontSize: 14,
      color: 'gray',
    },
    message: {
      fontSize: 14,
      color: 'blue',
    },
  });