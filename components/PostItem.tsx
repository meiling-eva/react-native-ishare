import { useGlobalContext } from '@/context/GlobalContext';
import { handleLikeRefChange } from '@/lib/appwrite';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface PostItemProps {
  item: any;
  isLiked: boolean;
  onLikeChange: (postId: string, isLiked: boolean) => void;
  layout?: 'grid' | 'list';
  showLikeButton?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ 
  item, 
  isLiked, 
  onLikeChange, 
  layout = 'grid',
  showLikeButton = true 
}) => {
  const { user, refreshLikePost, refreshLikePostCnt} = useGlobalContext();
  const likeRef = useRef<LottieView | null>(null);

  const handleLikePress = async (postId: string, like_count: number) => {
    await handleLikeRefChange(postId, user?.user_id as string, isLiked);

    if (isLiked) {
      // Play animation from frame 0 to 19 (unlike animation)           
      likeRef.current?.play(0, 19);
      onLikeChange(postId, false);
    } else {
      // Play animation from frame 19 to 66 (like animation)
      likeRef.current?.play(19, 66);
      onLikeChange(postId, true);
    }
    refreshLikePost();
  };

  const containerStyle = layout === 'grid' 
    ? 'flex-1 flex-col rounded-sm mt-1' 
    : 'flex-row rounded-sm mt-1 p-2 bg-white';

  const imageStyle = layout === 'grid' 
    ? {
        width: '100%' as const,
        height: 200,
        maxHeight: 270,
        aspectRatio: 1,
        resizeMode: 'cover' as const,
        borderRadius: 4
      }
    : {
        width: 80,
        height: 80,
        resizeMode: 'cover' as const,
        borderRadius: 4
      };

  return (
    <Pressable 
      className={containerStyle}
      onPress={() => {
        router.push(`/detail/${item?.$id}`);
      }}
    >
      <Image 
        source={{ uri: item.image }}
        style={imageStyle}
      />
      
      <View className={layout === 'grid' ? 'flex-row items-center justify-between my-1' : 'flex-1 ml-3'}>
        <Text className='text-black text-lg mt-2 font-bold' numberOfLines={layout === 'grid' ? 1 : 2}>
          {item.title}
        </Text>
        
        <View className={layout === 'grid' ? 'flex-row items-center justify-between' : 'flex-row items-center mt-1'}>
          <View className='flex-row items-center'>
            <Image
              source={{ uri: item.creator_avatar_url }}
              className='w-5 h-5 rounded-full' 
            />
            <Text className='text-black text-sm mx-1' numberOfLines={1}>
              {item.creator_name}
            </Text>
          </View>
          
          {showLikeButton && (
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
              <Text className='text-black text-sm'>
                {item.like_count > 0 ? item.like_count : ''}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default PostItem; 