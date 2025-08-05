import { useSideMenu } from '@/hooks/useSideMenu';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import HamburgerMenu from './HamburgerMenu';

interface HeaderWithMenuProps {
  title?: string;
  showMenu?: boolean;
  rightComponent?: React.ReactNode;
}

const HeaderWithMenu = ({ 
  title = 'iShare', 
  showMenu = true,
  rightComponent 
}: HeaderWithMenuProps) => {
  const { openSideMenu } = useSideMenu();

  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center flex-1">
          {showMenu && (
            <HamburgerMenu onPress={openSideMenu} />
          )}
          <Text className="text-lg font-semibold text-black ml-3 flex-1">
            {title}
          </Text>
        </View>
        {rightComponent && (
          <View className="ml-2">
            {rightComponent}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HeaderWithMenu; 