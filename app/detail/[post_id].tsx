import { useGlobalContext } from '@/context/GlobalContext';
import { createComment, getCommentsByPostId, getFollowingUsers, getPostById, getUserByUserId, handleFollowButton } from '@/lib/appwrite';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import Video from 'react-native-video';

const Detail = () => {
  const { post_id } = useLocalSearchParams();
  const { user, refreshFollowingUser, refreshUser} = useGlobalContext();

  const [post, setPost] = useState<any>(null);
  const [CreatorId, setCreatorId] = useState<string>('');
  const [CreatorName, setCreatorName] = useState<string>('');
  const [CreatorAvatarUrl, setCreatorAvatarUrl] = useState<string>('');
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState<any>('')
  const [comments, setComments] = useState<any>([])
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<any>(null);
  let isUserSelf = false

  const getData = async () => {
   // setLoading(true);
    try {
      const post = await getPostById(post_id as string);
      if (!post) {
        console.log("Post not found");
        return;
      }
      
      const creator = await getUserByUserId(post.creator_id);
      if (!creator) {
        console.log("Creator not found");
        return;
      }
      
      if (post.creator_id === user?.user_id) {
        isUserSelf = true
      }
      
      const followingUser = await getFollowingUsers(user?.user_id as string);
      let isFollowed = false
      if (followingUser) {
        isFollowed = followingUser.includes(creator.user_id);
      }
      const comments = await getCommentsByPostId(post_id as string)

      setPost(post);
      setCreatorId(creator.user_id);
      setCreatorName(creator.username || 'Unknown User');
      setCreatorAvatarUrl(creator.avatar_url || '');
      setIsFollowed(isFollowed);
      setComments(comments || [])
    } catch (error) {
      console.log("getData error", error);
    } 
    // finally {
    //   setLoading(false);
    // }
  }

  const handleFollow = async () => {
    try {
      await handleFollowButton(user?.user_id as string, CreatorId, isFollowed)
      setIsFollowed(!isFollowed)
      refreshFollowingUser()
      // Refresh user data to update follower/following counts
      refreshUser()
    } catch (error) {
      console.log("post_id handleFollow error:", error);
    } 
  }

  const handleSentComment = async () => {
    try {
      if (comment.trim() === '') {
        return
      }
      const res = await createComment(post_id as string, user?.user_id as string, user?.username as string, user?.avatar_url as string, comment)
      //setComments([...comments, comment])
      setComment('')
      getData()
    }
    catch (error) {
      console.log('handleSentComment error', error)
      throw error
    }
  }

  const handleVideoPress = () => {
    if (videoPlaying) {
      videoRef.current?.pause();
      setVideoPlaying(false);
    } else {
      videoRef.current?.play();
      setVideoPlaying(true);
    }
  }

  const handleVideoEnd = () => {
    setVideoPlaying(false);
  }

  const handleVideoError = (error: any) => {
    console.log('Video error:', error);
    Alert.alert('Error', 'Failed to load video');
  }

  useEffect(() => {
    getData();
  }, [refreshFollowingUser]);

  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-white flex-col justify-center items-center'>
        <Text className='text-black text-lg'>Loading post...</Text>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView className='flex-1 bg-white flex-col justify-center items-center'>
        <Text className='text-black text-lg'>Post not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white flex-col'>
      <ScrollView>
        {/* first row */}
        <View className='flex-row items-center justify-between bg-white mx-6 my-4'>
          <Pressable  onPress={() => {
              router.push(`/user_detail/${CreatorId}`);
            }}>
            <View className='flex-row items-center justify-between gap-2'>
              <Image
                source={{ 
                  uri: CreatorAvatarUrl && CreatorAvatarUrl.trim() !== '' 
                    ? CreatorAvatarUrl 
                    : 'https://via.placeholder.com/40x40?text=U'
                }}
                className='w-10 h-10 rounded-full' />
              <Text className='text-black text-md'>{CreatorName}</Text>
            </View>
          </Pressable>
              <Pressable className='rounded-full p-2 px-4 bg-blue-300 w-30'
                onPress={handleFollow}
                style={{
                  display: isUserSelf ? 'none' : 'flex'
                }}>
                <Text className='text-black text-md'>{isFollowed ? 'Following' : 'Follow'}</Text>
              </Pressable>
        </View>
        {/* second row */}
        <View className='flex-1 mx-2'>
          {post?.media && Array.isArray(post.media) && post.media.length > 0 ? (
            post.mediaType === 'video' ? (
              <Pressable onPress={handleVideoPress} className='w-full h-[300px] rounded-lg overflow-hidden'>
                <Video
                  ref={videoRef}
                  source={{ uri: post.media[0] }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                  onEnd={handleVideoEnd}
                  onError={handleVideoError}
                  paused={!videoPlaying}
                  repeat={false}
                  controls={false}
                />
                {!videoPlaying && (
                  <View className='absolute inset-0 bg-black bg-opacity-30 items-center justify-center'>
                    <View className='bg-white bg-opacity-90 rounded-full w-16 h-16 items-center justify-center'>
                      <Text className='text-3xl'>▶️</Text>
                    </View>
                    <Text className='text-white font-semibold mt-2'>Tap to play</Text>
                  </View>
                )}
              </Pressable>
            ) : post.media.length === 1 ? (
              <Image
                source={{ 
                  uri: post.media[0] && post.media[0].trim() !== '' 
                    ? post.media[0] 
                    : 'https://via.placeholder.com/400x300?text=No+Image'
                }}
                className='w-full h-[300px] rounded-lg'
                style={{ resizeMode: 'cover' }}
              />
            ) : (
              <View className='w-full'>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-2'>
                  {post.media.map((mediaUrl: string, index: number) => (
                    <Image
                      key={index}
                      source={{ 
                        uri: mediaUrl && mediaUrl.trim() !== '' 
                          ? mediaUrl 
                          : 'https://via.placeholder.com/300x300?text=Image'
                      }}
                      className='w-[300px] h-[300px] mr-2 rounded-lg'
                      style={{ resizeMode: 'cover' }}
                    />
                  ))}
                </ScrollView>
                <View className='flex-row justify-center mb-2'>
                  {post.media.map((_: string, index: number) => (
                    <View 
                      key={index}
                      className={`w-2 h-2 rounded-full mx-1 ${
                        index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </View>
              </View>
            )
          ) : (
            <View className='w-full h-[300px] bg-gray-200 rounded-lg items-center justify-center'>
              <Text className='text-lg text-gray-500'>No media</Text>
            </View>
          )}
          
          <Text className='text-lg font-semibold mt-2 mx-2'>{post?.title}</Text>
          <Text className='text-sm text-gray-500 mt-2 mx-2'>{post?.content} </Text>
        </View>
        {/* third row */}
        <View className='flex-row items-center justify-between mx-4 my-8 gap-2'>
          <Image 
            source={{ 
              uri: user?.avatar_url && user.avatar_url.trim() !== '' 
                ? user.avatar_url 
                : 'https://via.placeholder.com/40x40?text=U'
            }} 
            className='w-10 h-10 rounded-full' />
          <TextInput
            placeholder='Comment'
            className='flex-1 border border-blue-200 rounded-full p-2 justify-between item-center'
            value={comment}
            onChangeText={(text) => setComment(text)}
          ></TextInput>
          <Pressable
            onPress={handleSentComment}
            className='bg-blue-300 rounded-full p-2 px-4'>
            <Text className='text-balck'>Send</Text>
          </Pressable>
        </View>
        {/* fourth row */}
        <View className='px-4 pb-6'>
          <Text className='text-lg font-bold mb-4'>Comments({comments.length})</Text>
          {
            comments.map((comment: any) => (
              <View className='mb-2 pb-2 border-b border-gray-200'
                key={comment.$id}>
                <Pressable onPress={() => {
                  router.push(`/user_detail/${comment.from_user_id}`);
                }}>
                  <View className='flex-row items-center mb-2'>
                    <Image 
                      source={{ 
                        uri: comment.from_user_avatar_url && comment.from_user_avatar_url.trim() !== '' 
                          ? comment.from_user_avatar_url 
                          : 'https://via.placeholder.com/32x32?text=U'
                      }} 
                      className='w-8 h-8 rounded-full mr-2' />
                    <Text className='font-medium'>{comment.from_user_name}</Text>
                    <Text className='text-ts text-gray-300 mx-4'>
                      {new Date(comment.$createdAt).toLocaleDateString('en-AU')}
                    </Text>
                  </View>
                </Pressable>
                <Text className='ml-10 text-gray-500'>{comment.content}</Text>
              </View>
            ))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Detail