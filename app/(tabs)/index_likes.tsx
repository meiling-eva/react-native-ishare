import PostGridItem from '@/components/PostGridItem';
import { useGlobalContext } from '@/context/GlobalContext';
import { getLikedPost, getPostById } from '@/lib/appwrite';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const Index_likes = () => {
  const { user } = useGlobalContext();
  const { user_id } = useLocalSearchParams();
  const creator_id = user_id;
  const { refreshPostsCnt, refreshLikePost } = useGlobalContext();
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

  const handleLikeChange = (postId: string, isLiked: boolean) => {
    if (isLiked) {
      setLikedPosts(prev => [...prev, postId]);
    } else {
      setLikedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshPostsCnt, user, creator_id, refreshLikePost]);

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
      columnWrapperStyle={{ gap: 5 }}
      contentContainerStyle={{ gap: 4 }}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => {
        const isLiked = likedPosts.includes(item.$id);
        return (
          <PostGridItem 
            item={item}
            isLiked={isLiked}
            onLikeChange={handleLikeChange}
          />
        );
      }}
    />
  )
}

export default Index_likes