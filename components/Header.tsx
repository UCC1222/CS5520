import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

interface HeaderProps {
    appName: string;
    }

export default function Header({appName}: HeaderProps) {

  return (
    <View>
      <Text>Welcome to {appName}</Text>
    </View>
  );
}