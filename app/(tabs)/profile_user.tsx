import { useGlobalContext } from '@/context/GlobalContext';
import { logout } from '@/lib/appwrite';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import Index_likes from './index_likes';
import Index_userposts from './index_userposts';

const Tab = createMaterialTopTabNavigator();

const profile_user = () => {
  const { user, refreshUser, refreshFollowingUser } = useGlobalContext()
  //const [userData, setUserData] = useState<any>(null)

  const handleSignOut = async () => {
    await logout()
    router.push('/(auth)/sign_in')
    refreshUser()
  }

 

  useEffect(() => {
    //getUser();
  }, [refreshFollowingUser])

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-row justify-between ml-5'>
        { user && user.user_id && user.user_id.trim() !== '' ? (
          <View className='flex-row justify-between items-center w-full'>
            <View className='flex-row items-center'>
              <Image
                source={{
                  uri: user?.avatar_url && user.avatar_url.trim() !== ''? user.avatar_url
                    : 'https://via.placeholder.com/60x60?text=U'
                }}
                className='w-15 h-15 rounded-full' />
              <Text className='text-3xl font-bold ml-2'>
                {user?.username}
              </Text>
            </View>
            <Pressable className='rounded-lg p-2 px-4 bg-blue-300 mr-5' onPress={handleSignOut}>
              <Text className='text-center text-md text-black'>Sign out</Text>
            </Pressable>
          </View>
        )
          : (
            <View className='flex-row justify-between items-center w-full'>
              <Text className='text-md justify-center mt-3'>Guest User</Text>
              <Pressable className='rounded-lg p-2 px-4 bg-blue-300 mr-5'
                onPress={() => router.push('/(auth)/sign_in')}>
                <Text className='text-center font-md text-black'>Sign in</Text>
              </Pressable>
            </View>
          )}
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