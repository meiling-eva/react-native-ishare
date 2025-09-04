import PostGridItem from '@/components/PostGridItem';
import { useGlobalContext } from '@/context/GlobalContext';
import { getLikedPost, getPosts } from '@/lib/appwrite';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const Index_userposts = () => {
  const { user, updatedPosts } = useGlobalContext();
  const { refreshPostsCnt, refreshFollowingUser, refreshLikePost } = useGlobalContext();
  const { user_id } = useLocalSearchParams();
  const creator_id = user_id;
  const pageSize = 200;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  const fetchPosts = async (isRefresh = false) => {
    if (loading || !user?.user_id) return;
    setLoading(true);

    try {
      if (creator_id && creator_id !== user?.user_id) {
        const posts = await getPosts(0, pageSize, [creator_id as string]);
        setPosts(posts);
      }
      else {
        const posts = await getPosts(0, pageSize, [user.user_id]);
        setPosts(posts);
      }
    }
    catch (error) {
      console.log("fetchPosts error", error);
    }
    finally {
      setLoading(false);
    }
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



  // Fetch posts only when posts need to be refreshed
  useEffect(() => {
    // Only fetch data if user is authenticated (has a valid user_id)
    if (user?.user_id && user.user_id.trim() !== '') {
      fetchPosts(true);
    } else {
      // Clear data when user is not authenticated
      setPosts([]);
    }
  }, [refreshPostsCnt, user, creator_id]);

  // Fetch liked posts separately (no loading state for this)
  useEffect(() => {
    if (user?.user_id && user.user_id.trim() !== '') {
      getLikedPosts();
    } else {
      setLikedPosts([]);
    }
  }, [refreshLikePost, user?.user_id]);

  // Listen for global post updates
  useEffect(() => {
    if (updatedPosts.size > 0) {
      setPosts(prev => prev.map(post => {
        const updatedPost = updatedPosts.get(post.$id);
        return updatedPost || post;
      }));
    }
  }, [updatedPosts]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-black text-lg">Loading posts...</Text>
      </View>
    );
  }

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

  // Add placeholder item if odd number of posts to maintain two-column layout
  const dataWithPlaceholder = posts.length % 2 === 1 
    ? [...posts, { $id: 'placeholder', isPlaceholder: true }]
    : posts;

  return (
    <FlatList 
    data={dataWithPlaceholder}
    numColumns={2}
    columnWrapperStyle={{ gap: 4 }}
    contentContainerStyle={{ gap: 4 }}
    keyExtractor={(item) => item.$id}
    renderItem={({ item }) => {
      // Render placeholder for odd number of posts
      if (item.isPlaceholder) {
        return <View className="flex-1" />;
      }
      
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

export default Index_userposts