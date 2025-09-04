import { useGlobalContext } from '@/context/GlobalContext';
import { createPost, uploadFile } from '@/lib/appwrite';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { ID } from 'react-native-appwrite';

export default function Add() {
  const [media, setMedia] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'images' | 'video'>('images');
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

  const pickMedia = async () => {
    try {
      // Determine media type based on current selection
      let mediaTypes: any;
      if (media.length === 0) {
        // No media selected yet, allow both types
        mediaTypes = ImagePicker.MediaTypeOptions.All;
      } else if (mediaType === 'video') {
        // Video already selected, only allow video
        mediaTypes = ImagePicker.MediaTypeOptions.Videos;
      } else if (mediaType === 'images') {
        // Images already selected, only allow images
        mediaTypes = ImagePicker.MediaTypeOptions.Images;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypes,
        allowsMultipleSelection: mediaType === 'images', // Only allow multiple for images
        allowsEditing: false,
        quality: 1,
      });
      
      if (!result.canceled && result.assets.length > 0) {
        // console.log('ImagePicker result:', {
        //   canceled: result.canceled,
        //   assetCount: result.assets.length,
        //   firstAsset: result.assets[0],
        //   mediaTypes: mediaTypes
        // });
        
        const uploadedMedia: string[] = [];
        
        // Validate media type consistency
        const firstAssetType = result.assets[0].type;
        
        // Check if all assets are the same type
        const allSameType = result.assets.every(asset => asset.type === firstAssetType);
        if (!allSameType) {
          Alert.alert('Error', 'Cannot mix images and videos. Please select only one media type.');
          return;
        }
        
        // Check if trying to add different type than current
        if (media.length > 0) {
          if (mediaType === 'video' && firstAssetType !== 'video') {
            Alert.alert('Error', 'Cannot add images to a video post. Please clear the video first.');
            return;
          }
          if (mediaType === 'images' && firstAssetType !== 'image') {
            Alert.alert('Error', 'Cannot add video to an image post. Please clear the images first.');
            return;
          }
        }
        
        // Check video count limit
        if (firstAssetType === 'video' && result.assets.length > 1) {
          Alert.alert('Error', 'Only one video can be uploaded at a time.');
          return;
        }
        
        // Process media uploads
        for (const asset of result.assets) {
          // console.log('Processing asset:', {
          //   type: asset.type,
          //   uri: asset.uri,
          //   fileSize: asset.fileSize,
          //   mimeType: asset.mimeType
          // });
          
          if (asset.type === 'video') {
            //console.log('Detected video asset, uploading as video');
            // Handle video upload
            const videoFile = {
              uri: asset.uri,
              type: 'video/mp4',
              size: asset.fileSize || 0
            };
            const { fileUrl } = await uploadFile(ID.unique(), videoFile);
            uploadedMedia.push(fileUrl);
            setMediaType('video');
            //console.log('Video uploaded successfully, mediaType set to video');
          } else {
            //console.log('Detected image asset, uploading as image');
            // Handle image upload
            const compressedImage = await compressImage(asset.uri);
            if (compressedImage) {
              const { fileUrl } = await uploadFile(ID.unique(), compressedImage);
              uploadedMedia.push(fileUrl);
              setMediaType('images');
              //console.log('Image uploaded successfully, mediaType set to images');
            }
          }
        }
        
        // Update media state
        if (media.length === 0) {
          // First selection
          setMedia(uploadedMedia);
        } else {
          // Adding to existing selection
          setMedia(prev => [...prev, ...uploadedMedia]);
        }
      }
    }
    catch (error) {
      console.log(error);
      Alert.alert('Error picking media');
    }
    finally {
      setLoading(false);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(prev => {
      const newMedia = prev.filter((_, i) => i !== index);
      // Only reset mediaType to 'images' if we're removing the last item
      if (newMedia.length === 0) {
        setMediaType('images');
      }
      return newMedia;
    });
  };

  const clearMedia = () => {
    setMedia([]);
    setMediaType('images');
  };

  const handleAddPost = async () => {
     if (!user) {
      Alert.alert('Please login to add a post');
      return;
    }   
    if (!title || !content || media.length === 0) {
      Alert.alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      // console.log('Creating post with:', {
      //   title,
      //   content,
      //   media,
      //   mediaType,
      //   mediaLength: media.length
      // });
      const res = await createPost(title, content, media, mediaType, user.user_id, user.username, user.avatar_url, 0);
      setLoading(false);
      setTitle('');
      setContent('');
      setMedia([]);
      setMediaType('images');
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
      <View className='w-[320px] mt-5'>
        <View className='flex-row items-center justify-between mb-2'>
          <View>
            <Text className='text-lg font-semibold text-gray-700'>Media</Text>
            <Text className='text-xs text-gray-500'>
              {media.length === 0 
                ? 'Select images or video' 
                : mediaType === 'video' 
                  ? 'Video post (1 video max)' 
                  : `Image post (${media.length} selected)`
              }
            </Text>
          </View>
          {media.length > 0 && (
            <Pressable onPress={clearMedia} className='bg-red-500 px-3 py-1 rounded-lg'>
              <Text className='text-white text-sm'>Clear All</Text>
            </Pressable>
          )}
        </View>
        {media.length > 0 ? (
          <View className='border-2 border-gray-300 rounded-lg p-3 min-h-[200px]'>
            {mediaType === 'video' ? (
              <View className='items-center'>
                <Text className='text-xl font-bold text-blue-500'>Video Selected</Text>
                <Text className='text-sm text-gray-500 mt-2'>1 video file</Text>
                <Pressable onPress={clearMedia} className='bg-blue-500 px-4 py-2 rounded-lg mt-3'>
                  <Text className='text-white'>Change Video</Text>
                </Pressable>
              </View>
            ) : (
              <View className='flex-row flex-wrap gap-2'>
                {media.map((mediaUrl, index) => (
                  <View key={index} className='relative'>
                    <Image 
                      source={{ uri: mediaUrl }} 
                      className='w-20 h-20 rounded-lg'
                      style={{ resizeMode: 'cover' }}
                    />
                    <Pressable 
                      onPress={() => removeMedia(index)}
                      className='absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center'
                    >
                      <Text className='text-white text-xs'>×</Text>
                    </Pressable>
                  </View>
                ))}
                <Pressable 
                  onPress={pickMedia}
                  className='w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center'
                >
                  <Text className='text-gray-500 text-2xl'>+</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          <View className='space-y-3'>
            <Pressable
              onPress={() => {
                pickMedia();
              }}
              className='border-2 h-[200px] w-full rounded-lg border-dashed border-green-300 items-center justify-center bg-green-50'
            >
              <View className='items-center'>
                <Text className='text-lg font-bold text-green-600 text-center'>Add Media from Library</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
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
        disabled={loading || !title.trim() || !content.trim() || media.length === 0}
        className={`mt-3 p-3 h-[50px] w-[320px] rounded-lg flex items-center justify-center ${
          loading || !title.trim() || !content.trim() || media.length === 0
            ? 'bg-gray-300' 
            : 'bg-blue-500'
        }`}
      >
        <Text className={`text-center font-semibold ${
          loading || !title.trim() || !content.trim() || media.length === 0
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

