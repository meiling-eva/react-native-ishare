import { useGlobalContext } from '@/context/GlobalContext'
import { login } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'

const sign_in = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const {refreshUser} = useGlobalContext()

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const user = await login(email, password)
      setLoading(false)
      router.push('/profile_user')
      refreshUser()
    } catch (error) {
      console.error('Error signing in:', error)
      Alert.alert('Error', 'Error signing in, please check your email and password')
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-myBackGround'>
      <View className='flex-1 flex-col mx-2'>
        <Text className='text-2xl font-bold text-blue-500 text-center mt-20'>Sign in</Text>
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          className='border-2 border-gray-300 rounded-md p-2 mt-6 h-12'
        />
        <TextInput
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          className='border-2 border-gray-300 rounded-md p-2 mt-6 h-12'
          secureTextEntry={true}
        />
        <Pressable
          className='bg-blue-500 rounded-md p-2 mt-6 h-12'
          onPress={handleSignIn}
        >
          <Text className='text-white text-center my-1'>{loading ? 'Signing in...' : 'Sign in'}</Text>
        </Pressable>
        <View className='flex-row gap-2 items-center justify-center'>
          <Text className='text-gray-500'>Don't have an account?</Text>
          <Link href="/sign_up">
            <Text className='text-blue-500 items-center justify-center'>Sign up</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default sign_in