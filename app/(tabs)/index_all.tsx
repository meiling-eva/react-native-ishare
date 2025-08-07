import PostGridItem from '@/components/PostGridItem';
import { useGlobalContext } from '@/context/GlobalContext';
import { getLikedPost, getPosts } from '@/lib/appwrite';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const Index_all = () => {
  const { user, refreshPostsCnt, refreshLikePost } = useGlobalContext();
  const pageSize = 200;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const fetchPosts = async (isRefresh = false) => {
    //if (loading) return;
    setLoading(true);
    try {
      const posts = await getPosts(0, pageSize);
      setPosts(posts);
    }
    catch (error) {
      console.log("fetchPosts error", error);
      // If we get an authorization error, it means user is not authenticated
      // This is expected behavior when user is not logged in
      setPosts([]);
    }
    // finally {
    //   setLoading(false);
    // }
  }

  const getLikedPosts = async () => {
    // Only fetch liked posts if user is authenticated
    if (!user?.user_id || user.user_id.trim() === '') {
      setLikedPosts([]);
      return;
    }
    
    try {
      let likedPostRecords = await getLikedPost(user.user_id);
      // Extract post_id from like documents
      const postIds = likedPostRecords.map(record => record.post_id);
      setLikedPosts(postIds);
    } catch (error) {
      console.log("getLikedPosts error", error);
      setLikedPosts([]);
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
    // Only fetch data if user is authenticated (has a valid user_id)
    if (user?.user_id && user.user_id.trim() !== '') {
      fetchPosts(true);
      getLikedPosts();
    } else {
      // Clear data when user is not authenticated
      setPosts([]);
      setLikedPosts([]);
    }
  }, [refreshPostsCnt, refreshLikePost, user?.user_id]);

  // if (loading) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <Text className="text-black text-lg">Loading posts...</Text>
  //     </View>
  //   );
  // }

  if (!user?.user_id || user.user_id.trim() === '') {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-black text-lg">Please sign in to view posts</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-black text-lg">No posts found</Text>
      </View>
    );
  }

  return (
    <FlatList 
      data={posts}
      numColumns={2}
      columnWrapperStyle={{ gap: 4 }}
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

export default Index_all