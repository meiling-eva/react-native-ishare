import { useGlobalContext } from '@/context/GlobalContext';
import { createComment, followUser, getCommentsByPostId, getFollowingUsers, getPostById, getUserByUserId, unfollowUser } from '@/lib/appwrite';
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
    setLoading(true);
    try {
      const post = await getPostById(post_id as string);
      const creator = await getUserByUserId(post.creator_id);
      // console.log("creatorid", post.creator_id);
      // console.log("user_id", user?.user_id);
      // console.log("isUserSelf", isUserSelf);
      // console.log("creator.username", creator.username)
      if (post.creator_id=== user?.user_id) {
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
      setCreatorName(creator.username);
      setCreatorAvatarUrl(creator.avatar_url);
      setIsFollowed(isFollowed);
      setComments(comments)
    } catch (error) {
      console.log("getData error", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowed) {
        await unfollowUser(user?.user_id as string, CreatorId);
      } else {
        await followUser(user?.user_id as string, CreatorId);
      }
      setIsFollowed(!isFollowed)
      refreshFollowingUser()
    } catch (error) {
      console.log("handleFollow error", error);
    } finally {
      setLoading(false);
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
  }, []);

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
                source={{ uri: CreatorAvatarUrl }}
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
            source={{ uri: post?.image }}
            className='w-full h-[300px]'
          />
          <Text className='text-lg font-semibold mt-2 mx-2'>{post?.title}</Text>
          <Text className='text-sm text-gray-500 mt-2 mx-2'>{post?.content} </Text>
        </View>
        {/* third row */}
        <View className='flex-row items-center justify-between mx-4 my-8 gap-2'>
          <Image source={{ uri: user?.avatar_url }} className='w-10 h-10 rounded-full' />
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
                    <Image source={{ uri: comment.from_user_avatar_url }} className='w-8 h-8 rounded-full mr-2'></Image>
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