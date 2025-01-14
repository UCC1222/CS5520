import React from 'react';
import { StyleSheet, View } from 'react-native';
import Input from './components/Input';

export default function App() {
  return (
    <View style={styles.container}>
      <Input autoFocus={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '90%',
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
    marginTop: 5,
  },
  message: {
    fontSize: 14,
    color: 'blue',
    marginTop: 5,
  },
});