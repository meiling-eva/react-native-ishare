import { useGlobalContext } from '@/context/GlobalContext'
import { login, signInWithApple, signInWithGoogle } from '@/lib/appwrite'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Platform, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'

const sign_in = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const {refreshUser} = useGlobalContext()

  const handleSignIn = async () => {
    if(!email || !password){
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
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

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const result = await signInWithGoogle()
      setLoading(false)
      router.push('/profile_user')
      refreshUser()
    } catch (error) {
      console.error('Error signing in with Google:', error)
      Alert.alert('Error', 'Error signing in with Google')
      setLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    setLoading(true)
    try {
      const result = await signInWithApple()
      setLoading(false)
      router.push('/profile_user')
      refreshUser()
    } catch (error) {
      console.error('Error signing in with Apple:', error)
      Alert.alert('Error', 'Error signing in with Apple')
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

        {/* Divider */}
        <View className='flex-row items-center mt-6 mb-4'>
          <View className='flex-1 h-px bg-gray-300' />
          <Text className='mx-4 text-gray-500'>or</Text>
          <View className='flex-1 h-px bg-gray-300' />
        </View>

        {/* Google Sign In */}
        <Pressable
          className='bg-white border-2 border-gray-300 rounded-md p-2 mt-2 h-12 flex-row items-center justify-center'
          onPress={handleGoogleSignIn}
        >
          <Text className='text-gray-700 text-center font-medium'>Continue with Google</Text>
        </Pressable>

        {/* Apple Sign In - Only show on iOS */}
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={{ width: '100%', height: 48, marginTop: 8 }}
            onPress={handleAppleSignIn}
          />
        )}

        <View className='flex-row gap-2 items-center justify-center mt-6'>
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