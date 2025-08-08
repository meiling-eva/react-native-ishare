import PostGridItem from '@/components/PostGridItem';
import { useGlobalContext } from '@/context/GlobalContext';
import { getFollowingUsers, getLikedPost, getPosts } from '@/lib/appwrite';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const Index_follow = () => {
  const {user, refreshLikePost, updatedPosts} = useGlobalContext();
  const {refreshPostsCnt, refreshFollowingUserCnt} = useGlobalContext();
  const pageSize = 200;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [followingUser, setFollowingUser] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

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



  const fetchPosts = async (isRefresh = false) => {
    if (loading || !user?.user_id) return;
    //setLoading(true);

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
    // finally {
    //   setLoading(false);
    // }
  }

  // Fetch posts only when posts need to be refreshed
  useEffect(() => {
    // Only fetch data if user is authenticated (has a valid user_id)
    if (user?.user_id && user.user_id.trim() !== '') {
      fetchPosts(true);
    } else {
      // Clear data when user is not authenticated
      setPosts([]);
    }
  }, [refreshPostsCnt, user, refreshFollowingUserCnt]);

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
        <Text className="text-black text-lg">Loading follower's posts...</Text>
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

  return (
    <FlatList 
    data={posts}
    numColumns={2}
    columnWrapperStyle={{ gap: 4}}
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

export default Index_follow