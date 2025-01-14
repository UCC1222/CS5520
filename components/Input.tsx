import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function Input({ autoFocus }: { autoFocus: boolean }) {
  const inputRef = useRef<TextInput>(null);

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
      />
    </View>
  );
}