import Index_likes from '@/app/(tabs)/index_likes';
import Index_userposts from '@/app/(tabs)/index_userposts';
import { useGlobalContext } from '@/context/GlobalContext';
import { getUserByUserId, handleFollowButton, isFollowing } from '@/lib/appwrite';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const UserDetail = () => {
    const { user_id } = useLocalSearchParams();
    const creator_id = user_id;
    const { user, refreshFollowingUser, refreshUser } = useGlobalContext()
    const [creator, setCreator] = useState<any>(null);
    const [isFollowed, setIsFollowed] = useState(false);

    const getData = async () => {
        const res = await getUserByUserId(creator_id as string);
        setCreator(res);
        const isFollowingCreator = await isFollowing(user?.user_id as string, creator_id as string);
        let isFollowed = false
        if (isFollowingCreator) {
          isFollowed = true
        }
        setIsFollowed(isFollowed);
    }

    const handleFollowPress = async () => {
        await handleFollowButton(user?.user_id as string, creator_id as string, isFollowed)
        setIsFollowed(!isFollowed);
        refreshFollowingUser()
        // Refresh user data to update follower/following counts
        refreshUser()
    }

    useEffect(() => {
        getData();
    }, [refreshFollowingUser]);

    return (
        <SafeAreaView className='flex-1'>
            <View className='flex-row justify-between ml-5'>
                <View className='flex-row items-center gap-2'>
                    <Image 
                    source={{ 
                        uri: creator?.avatar_url && creator?.avatar_url.trim() !== '' 
                          ? creator?.avatar_url 
                          : 'https://via.placeholder.com/40x40?text=U'
                      }}
                    className='w-15 h-15 rounded-full' 
                    />
                    <Text className='text-3xl font-bold justify-center'>
                        {creator?.username}
                    </Text>
                </View>
            </View>
            <View className='flex-row mt-10 ml-5'>
                {/* <Text className='text-md'>Signature:</Text> */}
                <Text className='text-md'>{creator?.signature}</Text>
            </View>
            <View className='flex-row ml-5 justify-between'>
                <View className='flex-row mt-2'>
                    <Text className='text-md mt-1'>Followers: </Text>
                    <Text className='text-md mt-1 mx-2'>{creator?.followers_count}</Text>
                    <Text className='text-md ml-20 mt-1'>Following:</Text>
                    <Text className='text-md mt-1 mx-2'>{creator?.following_count}</Text>
                </View>
                <Pressable className='rounded-full p-2 px-4 w-30 bg-blue-300 mr-5 mt-1' onPress={handleFollowPress}>
                    <Text className='text-black text-md'>{isFollowed ? 'Following' : 'Follow'}</Text>
                </Pressable>
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

export default UserDetail

// function refreshFollowingUserCnt() {
//     throw new Error('Function not implemented.');
// }
