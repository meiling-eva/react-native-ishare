import { useGlobalContext } from '@/context/GlobalContext'
import { register } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'

const sign_up = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const {refreshUser} = useGlobalContext()

  const handleSignUp = async () => {
    setLoading(true)
    try {
      const user = await register(email, password, username)
      setLoading(false)
      router.push('/')
      refreshUser()
    } catch (error) {
      console.error('Error signing up:', error)
      Alert.alert('Error', 'Error signing up, please check your email and password')
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-myBackGround'>
      <View className='flex-1 flex-col mx-2'>
        <Text className='text-2xl font-bold text-blue-500 text-center mt-20'>Sign up</Text>
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          className='border-2 border-gray-300 rounded-md p-2 mt-6 h-12'
        />
        <TextInput
          placeholder='Username'
          value={username}
          onChangeText={setUsername}
          className='border-2 border-gray-300 rounded-md p-2 mt-6 h-12'
        />
        <TextInput
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          className='border-2 border-gray-300 rounded-md p-2 mt-6 h-12'
          secureTextEntry={false}
        />
        <TextInput
          placeholder='Confirm Password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          className='border-2 border-gray-300 rounded-md p-2 mt-6 h-12'
          secureTextEntry={false}
        />
        <Pressable
          className='bg-blue-500 rounded-md p-2 mt-6 h-12'
          onPress={handleSignUp}
        >
          <Text className='text-white text-center'>{loading ? 'Signing up...' : 'Sign up'}</Text>
        </Pressable>
        <View className='flex-row gap-2 items-center justify-center'>
          <Text className='text-gray-500'>Already have an account?</Text>
          <Link href="/sign_in">
            <Text className='text-blue-500'>Sign in</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default sign_up