import { useGlobalContext } from '@/context/GlobalContext';
import { getLikedPost, getPostById } from '@/lib/appwrite';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';

const Index_likes = () => {
  const { user } = useGlobalContext();
  const { user_id } = useLocalSearchParams();
  const creator_id = user_id;
  const { refreshPostsCnt, refreshLikePost, refreshLikePostCnt } = useGlobalContext();
  const pageSize = 200;
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    if (loading || !user?.user_id) return;
    setLoading(true);
    try {
      let likedPostRecords;
      if (creator_id && creator_id !== user?.user_id) {
        likedPostRecords = await getLikedPost(creator_id as string);
      }
      else {
        likedPostRecords = await getLikedPost(user?.user_id as string);
      }

      // Fetch actual post data for each liked post
      const postPromises = likedPostRecords.map((likeRecord: any) =>
        getPostById(likeRecord.post_id)
      );
      const actualPosts = await Promise.all(postPromises);
      setLikedPosts(actualPosts);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [refreshPostsCnt, user, creator_id, refreshLikePostCnt]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-black text-lg">Loading liked posts...</Text>
      </View>
    );
  }

  if (likedPosts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-black text-lg">No liked posts found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={likedPosts}
      numColumns={2}
      columnWrapperStyle={{ gap: 4 }}
      contentContainerStyle={{ gap: 6 }}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <Pressable
          className='flex-1 flex-col rounded-sm mt-1 w-1/2'
          onPress={() => {
            router.push(`/detail/${item?.$id}`);
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{
              width: '100%',
              height: 200,
              maxHeight: 270,
              aspectRatio: 1,
              resizeMode: 'cover',
              borderRadius: 4
            }}
          />
          <Text className='text-black text-md mt-2 my-2' numberOfLines={2} ellipsizeMode='tail'>{item.title} </Text>
          <View className='flex-row items-center mt-1'>
            <Image
              source={{ uri: item.creator_avatar_url }}
              className='w-5 h-5 rounded-full'
            />
            <Text className='text-black text-sm mx-1 flex-1' numberOfLines={1} ellipsizeMode='tail'>{item.creator_name} </Text>
            <Text className='text-black text-sm ml-1'>❤️{item.like_count}</Text>
          </View>

          
        </Pressable>
      )}
    />
  )
}

export default Index_likes