import { useGlobalContext } from '@/context/GlobalContext'
import { logout } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React from 'react'
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native'

const profile = () => {
  const { user, refreshUser } = useGlobalContext()

  const handleSignOut = async () => {
    await logout()
    router.push('/sign_in')
    refreshUser()
  }
  
  return (
    <SafeAreaView className='flex-1 bg-myBackGround'>
      <View className='flex-1 flex-col items-center'>
        <View className='flex-row gap-2 items-center justify-center'>
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} className='w-10 h-10 rounded-full' />
        ) : (<></>)}
          <Text className='text-2xl font-bold'>
            {user?.username}
            </Text>
        </View>
        <Link href="/sign_in" className='p-4 rounded-lg w-full'>
          <Text className='text-center font-semibold text-lg'>Sign in</Text>
        </Link>
        <Link href="/sign_up" className='p-4 rounded-lg w-full'>
          <Text className='text-center font-semibold text-lg'>Sign up</Text>
        </Link>
        <Pressable className='p-4 rounded-lg w-full' onPress={handleSignOut}>
          <Text className='text-center font-semibold text-lg'>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default profile