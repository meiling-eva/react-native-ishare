import TabLayout from '@/app/(tabs)/_layout';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SideMenu from './SideMenu';

const Drawer = createDrawerNavigator();

const CustomDrawer = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={() => <SideMenu />}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              width: 280,
            },
            drawerType: 'front',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Drawer.Screen
            name="MainTabs"
            component={TabLayout}
            options={{
              drawerLabel: 'Home',
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default CustomDrawer; 