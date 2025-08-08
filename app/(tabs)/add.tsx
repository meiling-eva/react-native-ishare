import { useGlobalContext } from '@/context/GlobalContext';
import { createPost, uploadFile } from '@/lib/appwrite';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { ID } from 'react-native-appwrite';

export default function Add() {
  const [image, setImage] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {user, refreshPosts } = useGlobalContext()

  const compressImage = async (uri: string, quality: number = 0.2, maxWidthOrHeight: number = 640) => {
    try {
      const mainpResult = await manipulateAsync(
        uri, 
        [
          { 
            resize: { width: maxWidthOrHeight } 
          }
        ],
        {
          compress: quality,
          format: SaveFormat.JPEG,
        }
      );
      return mainpResult
    }
    catch (error) {
      console.log(error);
      Alert.alert('Error compressing image');
      return null;
    }
  }

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const compressedImage = await compressImage(result.assets[0].uri);
        if (compressedImage && user) {
          const { fileId, fileUrl } = await uploadFile(ID.unique(), compressedImage);
          //setImage(compressedImage.uri);
          setImage(fileUrl);
        }
      }
    }
    catch (error) {
      console.log(error);
      Alert.alert('Error picking image');
    }
    finally {
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
     if (!user) {
      Alert.alert('Please login to add a post');
      return;
    }   
    if (!title || !content || !image) {
      Alert.alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await createPost(title, content, image, user.user_id, user.username, user.avatar_url, 0);
      setLoading(false);
      setTitle('');
      setContent('');
      setImage('');
      Alert.alert('Post added successfully');
      refreshPosts();
      router.push('/');
    }
    catch (error) {
      console.log(error);
      Alert.alert('Error adding post');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white flex-col items-center'>
      <Text className='text-2xl font-bold text-blue-500'>Add Post</Text>
      <Pressable
        onPress={pickImage}
        className='border-2 mt-5 h-[280px] w-[320px] rounded-lg border-dashed border-gray-300'
      >
        <View className='flex-1 items-center justify-center'>
          {
            image ? (
              <Image source={{ uri: image }} className='w-full h-full rounded-lg' />
            ) : (
              <View className='items-center'>
                <Text className='text-xl font-bold text-gray-500 text-center'>Add Featured Image</Text>
                <Text className='text-sm text-gray-400 text-center mt-2'>Tap to select from gallery</Text>
              </View>
            )
          }
        </View>
      </Pressable>
      <View className='w-[320px] mt-10'>
        <TextInput
          placeholder='Enter your title...'
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          className='border-2 h-[45px] w-full rounded-lg border-blue-300 text-lg '
        />
        <Text className='text-xs text-gray-500 mt-1 text-right'>
          {title.length}/100 characters
        </Text>
      </View>
      <View className='w-[320px] mt-5'>
        <TextInput
          placeholder='Write your content here...'
          value={content}
          onChangeText={setContent}
          multiline={true}
          textAlignVertical="top"
          numberOfLines={8}
          maxLength={2000}
          className='border-2 p-3 h-[200px] w-full rounded-lg border-blue-300'
          style={{
            textAlignVertical: 'top',
            paddingTop: 12,
            paddingBottom: 12,
            lineHeight: 20
          }}
        />
        <Text className='text-xs text-gray-500 mt-1 text-right'>
          {content.length}/2000 characters
        </Text>
      </View>
      <Pressable
        onPress={handleAddPost}
        disabled={loading || !title.trim() || !content.trim() || !image}
        className={`mt-3 p-3 h-[50px] w-[320px] rounded-lg flex items-center justify-center ${
          loading || !title.trim() || !content.trim() || !image 
            ? 'bg-gray-300' 
            : 'bg-blue-500'
        }`}
      >
        <Text className={`text-center font-semibold ${
          loading || !title.trim() || !content.trim() || !image 
            ? 'text-gray-500' 
            : 'text-white'
        }`}>
          {loading ? 'Publishing...' : 'Publish Post'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
// function manipulateAsync(uri: string, arg1: { resize: { width: number; }; }[], arg2: { compress: number; format: any; }) {
//   throw new Error('Function not implemented.');
// }

