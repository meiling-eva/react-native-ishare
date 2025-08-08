import { useGlobalContext } from '@/context/GlobalContext';
import { createComment, getCommentsByPostId, getFollowingUsers, getPostById, getUserByUserId, handleFollowButton } from '@/lib/appwrite';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';

const Detail = () => {
  const { post_id } = useLocalSearchParams();
  const { user, refreshFollowingUser} = useGlobalContext();

  const [post, setPost] = useState<any>(null);
  const [CreatorId, setCreatorId] = useState<string>('');
  const [CreatorName, setCreatorName] = useState<string>('');
  const [CreatorAvatarUrl, setCreatorAvatarUrl] = useState<string>('');
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState<any>('')
  const [comments, setComments] = useState<any>([])
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
          <Image
            source={{ 
              uri: post?.image && post.image.trim() !== '' 
                ? post.image 
                : 'https://via.placeholder.com/400x300?text=No+Image'
            }}
            className='w-full h-[300px]'
          />
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