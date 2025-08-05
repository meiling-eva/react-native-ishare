import React from 'react';
import { Pressable, Text } from 'react-native';

interface HamburgerMenuProps {
  onPress: () => void;
  size?: number;
  color?: string;
}

const HamburgerMenu = ({ 
  onPress, 
  size = 24, 
  color = '#000' 
}: HamburgerMenuProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="p-2 active:bg-gray-100 rounded-lg"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={{ fontSize: size, color }}>☰</Text>
    </Pressable>
  );
};

export default HamburgerMenu; 