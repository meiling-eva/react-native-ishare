import TabLayout from '@/app/(tabs)/_layout';
import { useSideMenu } from '@/hooks/useSideMenu';
import React from 'react';
import { View } from 'react-native';
import SideMenuModal from './SideMenuModal';

const TabLayoutWithSideMenu = () => {
  const { isSideMenuVisible, closeSideMenu } = useSideMenu();

  return (
    <View style={{ flex: 1 }}>
      <TabLayout />
      <SideMenuModal 
        visible={isSideMenuVisible} 
        onClose={closeSideMenu} 
      />
    </View>
  );
};

export default TabLayoutWithSideMenu; 