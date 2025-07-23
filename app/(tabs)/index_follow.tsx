import { useGlobalContext } from '@/context/GlobalContext';
import { getFollowingUsers, getPosts } from '@/lib/appwrite';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';

const Index_follow = () => {
  const {user} = useGlobalContext();
  const {refreshPostsCnt, refreshFollowingUserCnt} = useGlobalContext();
  const pageSize = 10;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [followingUser, setFollowingUser] = useState<string[]>([]);

  const fetchPosts = async (isRefresh = false) => {
    if (loading || !user?.user_id) return;
    setLoading(true);

    let followingUser = await getFollowingUsers(user?.user_id as string);
    setFollowingUser(followingUser);

    if(followingUser.length === 0){
      followingUser = ['0']
    }
     
    try {
      const posts = await getPosts(0, pageSize, followingUser);
      setPosts(posts);
    }
    catch (error) {
      console.log("fetchPosts error", error);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts(true);
  }, [refreshPostsCnt, user, refreshFollowingUserCnt]);

  return (
    <FlatList data={posts} 
    numColumns={2}
    columnWrapperStyle={{ gap: 4 }}
    contentContainerStyle={{ gap: 4 }}
    renderItem={({ item }) => (
      <Pressable className='flex-1 flex-col rounded-sm mt-1'
      onPress={() => {
        router.push(`/detail/${item?.$id}`);
      }}
      >
        <Image source={{ uri: item.image }} 
        style={{ 
          width: '100%',
          height: 200,
          maxHeight: 270,
          aspectRatio: 1,
          resizeMode: 'cover',
          borderRadius: 4
          }} />
        <Text className='text-black text-md mt-2 my-2'>{item.title} </Text>
        <View className='flex-row items-center'>
            <Image
              source={{ uri: item.creator_avatar_url }}
              className='w-5 h-5 rounded-full' />
            <Text className='text-black text-sm mx-1'>{item.creator_name} </Text>
            <View className='flex-row items-center'>
            {/* <AnimatedLikeButton
              primary='grey'
              accent='red'
              onPress={() => { }}
            /> */}
            <Text className='text-black text-sm mx-1'>{item.like_count} </Text>
            </View>
          </View>
      </Pressable>
    )}    
    >
    </FlatList>
  )
}

export default Index_follow