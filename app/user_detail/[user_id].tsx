import Index_likes from '@/app/(tabs)/index_likes';
import Index_userposts from '@/app/(tabs)/index_userposts';
import { useGlobalContext } from '@/context/GlobalContext';
import { getUserByUserId } from '@/lib/appwrite';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const UserDetail = () => {
    const { user_id } = useLocalSearchParams();
    const creator_id = user_id;
    const { user } = useGlobalContext()
    const [creator, setCreator] = useState<any>(null);

    const getData = async () => {
        const res = await getUserByUserId(creator_id as string);
        //console.log("res", res);
        setCreator(res);
        console.log("creator", res)
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <SafeAreaView className='flex-1'>
            <View className='flex-row justify-between ml-5'>
                <View className='flex-row items-center gap-2'>
                    <Image source={{ uri: creator?.avatar_url }} className='w-15 h-15 rounded-full' />
                    <Text className='text-3xl font-bold justify-center'>
                        {creator?.username}
                    </Text>
                </View>
            </View>
            <View className='mt-10 ml-5'>
                <Text className='text-md'>Signature:</Text>
                <Text className='text-md'>{creator?.signature}</Text>
            </View>
            <View className='flex-row ml-5 justify-between'>
                <View className='flex-row'>
                    <Text className='text-md mt-1'>Follow: </Text>
                    <Text className='text-md mt-1'>{creator?.followers_count}</Text>
                    <Text className='text-md ml-20 mt-1'>Following:</Text>
                    <Text className='text-md mt-1'>{creator?.following_count}</Text>
                </View>
                <Pressable className='rounded-lg p-1 w-30 bg-blue-500 mr-5' >
                    <Text className='text-white font-semibold'>Follow</Text>
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