import { useGlobalContext } from '@/context/GlobalContext';
import { logout } from '@/lib/appwrite';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import Index_likes from './index_likes';
import Index_userposts from './index_userposts';

const Tab = createMaterialTopTabNavigator();

const profile_user = () => {
  const { user, refreshUser } = useGlobalContext()

  const handleSignOut = async () => {
    await logout()
    router.push('/sign_in')
    refreshUser()
  }


  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-row justify-between ml-5'>
        <View className='flex-row '>
          <Image source={{ uri: user?.avatar_url }} className='w-15 h-15 rounded-full' />
          <Text className='text-3xl font-bold justify-center'>
            {user?.username}
          </Text>
        </View>
        <View className='mr-5'>
          <Pressable className='rounded-lg p-2 px-4 w-30 bg-blue-300 mr-5 mt-1' onPress={handleSignOut}>
            <Text className='text-center text-md text-black'>Sign out</Text>
          </Pressable>
        </View>
      </View>      
        <View className='flex-row mt-10 ml-5'>
          {/* <Text className='text-md'>Signature:</Text> */}
          <Text className='text-md'>{user?.signature}</Text>
        </View>
      <View className='flex-row ml-5 justify-between'>
        <View className='flex-row mt-2 '>
          <Text className='text-md mt-1'>Followers: </Text>
          <Text className='text-md mt-1 mx-2'>{user?.followers_count}</Text>
          <Text className='text-md ml-20 mt-1'>Following:</Text>
          <Text className='text-md mt-1 mx-2'>{user?.following_count}</Text>
        </View>
      </View>
        <View className='flex-1 bg-white mt-5'>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                width: '100%',
                height: 40,
              },
              tabBarActiveTintColor: '#000',
              tabBarInactiveTintColor: '#000',
              tabBarLabelStyle: {
                fontSize: 12,
              },
            }}
          >            
            <Tab.Screen name="Posts" component={Index_userposts} />
            <Tab.Screen name="Likes" component={Index_likes} />
          </Tab.Navigator>
        </View>
    </SafeAreaView>
  )
}

export default profile_user