import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native';
import Index_all from './index_all';
import Index_follow from './index_follow';

const Tab = createMaterialTopTabNavigator();


export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#000',
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
      >        
      <Tab.Screen name="Expole" component={Index_all} />
      <Tab.Screen name="Following" component={Index_follow} />
      {/* <Tab.Screen name="NearBy" component={Index_nearby} /> */}
      </Tab.Navigator>  
    </SafeAreaView>

  );
}

