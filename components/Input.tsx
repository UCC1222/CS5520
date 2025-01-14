import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function Input() {
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Type something..." />
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
  },
});