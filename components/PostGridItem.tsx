import { useGlobalContext } from '@/context/GlobalContext';
import { getFirstMedia, getPostById, handleLikeRefChange } from '@/lib/appwrite';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface PostGridItemProps {
  item: any;
  isLiked: boolean;
  onLikeChange: (postId: string, isLiked: boolean) => void;
}

const PostGridItem: React.FC<PostGridItemProps> = ({ item, isLiked, onLikeChange }) => {
  const { user, refreshLikePost, refreshLikePostCnt, updatePost } = useGlobalContext();
  const likeRef = useRef<LottieView | null>(null);

  const handleLikePress = async (postId: string, like_count: number) => {
    await handleLikeRefChange(postId, user?.user_id as string, isLiked);
    
    if (isLiked) {
      // Play animation from frame 66 to 19 (unlike animation)           
      likeRef.current?.play(66, 19);
      onLikeChange(postId, false);
    } else {
      // Play animation from frame 19 to 66 (like animation)
      likeRef.current?.play(19, 66);
      onLikeChange(postId, true);
    }
    
    // Refresh the post data to get updated like_count
    try {
      const updatedPost = await getPostById(postId);
      updatePost(postId, updatedPost);
    } catch (error) {
      console.log('Error refreshing post data:', error);
    }
    
    refreshLikePost();
  };

  return (
    <Pressable 
      className='flex-1 flex-col rounded-sm mt-1'
      onPress={() => {
        router.push(`/detail/${item?.$id}`);
      }}
    >
      {(() => {
        const media = item.media && Array.isArray(item.media) ? item.media : [];
        const mediaType = item.mediaType || 'images';
        const firstMedia = media.length > 0 ? media[0] : getFirstMedia(item);
        
        if (firstMedia) {
          if (mediaType === 'video') {
            return (
              <View className='w-full h-[200px] bg-gray-200 rounded-lg items-center justify-center'>
                <Text className='text-lg font-bold text-gray-600'>🎥 Video</Text>
                <Text className='text-sm text-gray-500 mt-1'>Tap to play</Text>
              </View>
            );
          } else if (media.length > 1) {
            return (
              <View className='relative w-full h-[200px] rounded-lg overflow-hidden'>
                <Image 
                  source={{ uri: firstMedia }}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    borderRadius: 4
                  }} 
                />
                <View className='absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded-lg'>
                  <Text className='text-white text-xs font-bold'>+{media.length - 1}</Text>
                </View>
              </View>
            );
          } else {
            return (
              <Image 
                source={{ uri: firstMedia }}
                style={{
                  width: '100%',
                  height: 200,
                  maxHeight: 270,
                  aspectRatio: 1,
                  resizeMode: 'cover',
                  borderRadius: 4
                }} 
              />
            );
          }
        } else {
          return (
            <View className='w-full h-[200px] bg-gray-200 rounded-lg items-center justify-center'>
              <Text className='text-gray-500'>No media</Text>
            </View>
          );
        }
      })()}
      <View className='flex-row items-center justify-between my-1'>
        <Text className='text-black text-lg mt-2 font-bold'>{item.title}</Text>
      </View>
      <View className='flex-row items-center'>
        <View className='flex-row items-center flex-1'>
          <Image
            source={{ uri: item.creator_avatar_url }}
            className='w-5 h-5 rounded-full' 
          />
          <Text className='text-black text-sm mx-1 flex-1' numberOfLines={1} ellipsizeMode="tail">
            {item.creator_name}
          </Text>
        </View>
        
        <View className='flex-row items-center'>
          <Pressable onPress={() => handleLikePress(item.$id, item.like_count)}>
            <LottieView
              ref={(ref) => {
                likeRef.current = ref;
                // Set initial animation state immediately when ref is set
                if (ref && isLiked) {
                  ref.play(66, 66);
                } else if (ref && !isLiked) {
                  ref.play(19, 19);
                }
              }}
              source={require('@/assets/lottie/like.json')}
              autoPlay={false}
              loop={false}
              style={{ width: 35, height: 35 }}
            />
          </Pressable>
          <Text className='text-black text-sm ml-1'>
            {item.like_count > 0 ? item.like_count : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default PostGridItem; 