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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});