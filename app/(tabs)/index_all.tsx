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
    }
    // finally {
    //   setLoading(false);
    // }
  }

  const getLikedPosts = async () => {
    let likedPostRecords = await getLikedPost(user?.user_id as string);
    // Extract post_id from like documents
    const postIds = likedPostRecords.map(record => record.post_id);
    setLikedPosts(postIds);
  }

  const handleLikeChange = (postId: string, isLiked: boolean) => {
    if (isLiked) {
      setLikedPosts(prev => [...prev, postId]);
    } else {
      setLikedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  useEffect(() => {
    fetchPosts(true);
    getLikedPosts();
  }, [refreshPostsCnt, refreshLikePost]);

  // if (loading) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <Text className="text-black text-lg">Loading posts...</Text>
  //     </View>
  //   );
  // }

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

export default Index_all