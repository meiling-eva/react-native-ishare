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
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  const fetchPosts = async () => {
    if (!user?.user_id) return;
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
      
      // Extract post IDs for like state tracking
      const postIds = likedPostRecords.map(record => record.post_id);
      setLikedPostIds(postIds);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    } 
    finally {
      setLoading(false);
    }
  }

  const handleLikeChange = (postId: string, isLiked: boolean) => {
   // console.log(`handleLikeChange called: postId=${postId}, isLiked=${isLiked}`);
    if (isLiked) {
      setLikedPostIds(prev => {
        const newIds = [...prev, postId];
        //console.log('Adding post to likedPostIds:', newIds);
        return newIds;
      });
    } else {
      setLikedPostIds(prev => {
        const newIds = prev.filter(id => id !== postId);
        //console.log('Removing post from likedPostIds:', newIds);
        return newIds;
      });
      // Also remove from likedPosts array
      setLikedPosts(prev => prev.filter(post => post.$id !== postId));
    }
  };

  useEffect(() => {
    if(user?.user_id && user.user_id.trim() !== ''){
      fetchPosts();
    }
    else{
      setLikedPosts([]);
      setLikedPostIds([]);
    }
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
      columnWrapperStyle={{ gap: 4 }}
      contentContainerStyle={{ gap: 4 }}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => {
        const isLiked = likedPostIds.includes(item.$id);
        //console.log(`Post ${item.$id} isLiked: ${isLiked}, likedPostIds:`, likedPostIds);
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