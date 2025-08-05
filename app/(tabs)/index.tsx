import SideMenuModal from '@/components/SideMenuModal';
import { useGlobalContext } from '@/context/GlobalContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Pressable, SafeAreaView, Text } from 'react-native';
import Index_all from './index_all';
import Index_follow from './index_follow';

const Tab = createMaterialTopTabNavigator();

export default function HomeScreen() {
  const { isSideMenuVisible, closeSideMenu, toggleSideMenu } = useGlobalContext();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <SideMenuModal visible={isSideMenuVisible} onClose={closeSideMenu} />
      <Pressable 
        onPress={toggleSideMenu}
        style={{
          position: 'absolute',
          top: 70,
          left:1,
          zIndex: 1000,
          padding: 6,
        }}
      >
        <Text style={{ fontSize: 24 }}>☰</Text>
      </Pressable>
      <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: {
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
      >   
      <Tab.Screen name="Expole" component={Index_all} />
      <Tab.Screen name="Following" component={Index_follow} />
      </Tab.Navigator>  
    </SafeAreaView>

  );
}

