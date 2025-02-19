import React from 'react';
import { Pressable, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface PressableButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const PressableButton: React.FC<PressableButtonProps> = ({ 
  children, 
  onPress, 
  style 
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed
      ]}
      android_ripple={{ 
        color: '#dddddd',
        borderless: false
      }}
    >
      <View>
        {children}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 6,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: '#ccc',
  }
});

export default PressableButton;