import { useGlobalContext } from '@/context/GlobalContext';
import { getLikedPost, getPosts, likePost, likePostByUserId, unlikePost, unlikePostByUserId } from '@/lib/appwrite';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';

const Index_all = () => {

  const { user, refreshPostsCnt, refreshLikePost, refreshLikePostCnt } = useGlobalContext();
  const pageSize = 200;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const likeRefs = useRef<{ [key: string]: LottieView | null }>({});
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchPosts = async (isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const posts = await getPosts(0, pageSize);
      setPosts(posts);
    }
    catch (error) {
      console.log("fetchPosts error", error);
    }
    finally {
      setLoading(false);
    }
  }

  const getLikedPosts = async () => {
    let likedPosts = await getLikedPost(user?.user_id as string);
    //console.log("index_all likedPosts:", likedPosts)
    setLikedPosts(likedPosts);
  }

  const handleLikePress = async (postId: string, like_count: number) => {
    const isLiked = likedPosts.includes(postId);
    if (isLiked) {
      // Play animation from frame 19 to 0 (unlike animation)           
      likeRefs.current[postId]?.play(0, 19);
      if(like_count > 0){
        setLikeCount(like_count - 1);
      }
      await unlikePostByUserId(postId, user?.user_id as string);
      await unlikePost(postId);
      // setLikedPosts(prev => {
      //   return prev.filter(id => id !== postId);
      // });
    } else {
      setLikeCount(like_count + 1);
      // Play animation from frame 0 to 66 (like animation)
      likeRefs.current[postId]?.play(19, 66);
      await likePostByUserId(postId, user?.user_id as string);
      await likePost(postId);
      // setLikedPosts(prev => [...prev, postId]);
    }
    setIsLiked(isLiked);
    refreshLikePostCnt;
  };

  useEffect(() => {
    fetchPosts(true);
    getLikedPosts();
  }, [refreshPostsCnt]);

  // useEffect(() => {
  //   // Play animation for the first liked post, if any
  //   // if (likedPosts.length > 0) {
  //   //   likeRefs.current[likedPosts[0]]?.play(19, 19);
  //   // }
  //   //isLiked? likeRefs.current[likedPosts[0]]?.play(66, 66): likeRefs.current[likedPosts[0]]?.play(19, 19);
  //   // if(isLiked){
  //   //   likeRefs.current[likedPosts[0]]?.play(66, 66);
  //   // }
  //   // else{
  //   //   likeRefs.current[likedPosts[0]]?.play(19, 19);
  //   //   console.log("likeref",likeRefs.current[likedPosts[0]])
  //   // }
  // },[])

  return (
    <FlatList data={posts}
      numColumns={2}
      columnWrapperStyle={{ gap: 5 }}
      contentContainerStyle={{ gap: 4 }}
      renderItem={({ item }) => {
        const isLiked = likedPosts.includes(item.$id);
        //console.log("likedPosts", likedPosts)
        //console.log("index all isLiked", item.$id, isLiked)
        return (
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
            <View className='flex-row items-center justify-between my-1'>
              <Text className='text-black text-lg mt-2 font-bold'>{item.title} </Text>
            </View>
            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center'>
                <Image
                source={{ uri: item.creator_avatar_url }}
                className='w-5 h-5 rounded-full' />
              <Text className='text-black text-sm mx-1'>{item.creator_name} </Text>
              </View>
              
              <View className='flex-row items-center'>
                <Pressable onPress={() => handleLikePress(item.$id, item.like_count)}>
                  <LottieView
                    ref={(ref) => {
                      likeRefs.current[item.$id] = ref;
                      isLiked? ref?.play(66, 66): ref?.play(19, 19);
                    }}
                    source={require('@/assets/lottie/like.json')}
                    autoPlay={true}
                    loop={false}
                    style={{ width: 35, height: 35 }}
                  />
                </Pressable>
                <Text className='text-black text-sm'>{item.like_Count > 0 ? item.like_Count : ''} </Text>
              </View>
            </View>
          </Pressable>
        );
          }}
        >
    </FlatList>
  )
}

export default Index_all