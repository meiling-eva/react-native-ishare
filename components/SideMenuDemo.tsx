import { useSideMenu } from '@/hooks/useSideMenu';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import HeaderWithMenu from './HeaderWithMenu';
import SideMenuModal from './SideMenuModal';

const SideMenuDemo = () => {
  const { isSideMenuVisible, closeSideMenu } = useSideMenu();

  return (
    <View className="flex-1 bg-white">
      <HeaderWithMenu title="Side Menu Demo" />
      
      <ScrollView className="flex-1 p-4">
        <Text className="text-lg font-semibold mb-4">
          Side Menu Implementation
        </Text>
        
        <View className="bg-blue-50 p-4 rounded-lg mb-4">
          <Text className="text-sm text-blue-800">
            This demo shows how to integrate the side menu into your React Native app.
          </Text>
        </View>

        <View className="space-y-4">
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="font-semibold mb-2">Features:</Text>
            <Text className="text-sm text-gray-600">• User profile display</Text>
            <Text className="text-sm text-gray-600">• Navigation to different screens</Text>
            <Text className="text-sm text-gray-600">• Logout functionality</Text>
            <Text className="text-sm text-gray-600">• Settings and help options</Text>
          </View>

          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="font-semibold mb-2">Usage:</Text>
            <Text className="text-sm text-gray-600">1. Import useSideMenu hook</Text>
            <Text className="text-sm text-gray-600">2. Add HeaderWithMenu component</Text>
            <Text className="text-sm text-gray-600">3. Include SideMenuModal in your layout</Text>
          </View>
        </View>
      </ScrollView>

      <SideMenuModal 
        visible={isSideMenuVisible} 
        onClose={closeSideMenu} 
      />
    </View>
  );
};

export default SideMenuDemo; 