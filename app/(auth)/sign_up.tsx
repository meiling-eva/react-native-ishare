import { useGlobalContext } from '@/context/GlobalContext'
import { register, signInWithApple, signInWithGoogle } from '@/lib/appwrite'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Platform, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'

const sign_up = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const {refreshUser} = useGlobalContext()

  const handleSignUp = async () => {
    if(!email || !password || !confirmPassword || !username){
      Alert.alert('Error', 'Please fill in all fields')
    }
    if(password !== confirmPassword){
      Alert.alert('Error', 'Passwords do not match')
      return
    }
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

  const handleGoogleSignUp = async () => {
    setLoading(true)
    try {
      const result = await signInWithGoogle()
      setLoading(false)
      router.push('/')
      refreshUser()
    } catch (error) {
      console.error('Error signing up with Google:', error)
      Alert.alert('Error', 'Error signing up with Google')
      setLoading(false)
    }
  }

  const handleAppleSignUp = async () => {
    setLoading(true)
    try {
      const result = await signInWithApple()
      setLoading(false)
      router.push('/')
      refreshUser()
    } catch (error) {
      console.error('Error signing up with Apple:', error)
      Alert.alert('Error', 'Error signing up with Apple')
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
          secureTextEntry={true}
        />
        <TextInput
          placeholder='Confirm Password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          className='border-2 border-gray-300 rounded-md p-2 mt-6 h-12'
          secureTextEntry={true}
        />
        <Pressable
          className='bg-blue-500 rounded-md p-2 mt-6 h-12'
          onPress={handleSignUp}
        >
          <Text className='text-white text-center justify-center my-1'>{loading ? 'Signing up...' : 'Sign up'}</Text>
        </Pressable>

        {/* Divider */}
        <View className='flex-row items-center mt-6 mb-4'>
          <View className='flex-1 h-px bg-gray-300' />
          <Text className='mx-4 text-gray-500'>or</Text>
          <View className='flex-1 h-px bg-gray-300' />
        </View>

        {/* Google Sign Up */}
        <Pressable
          className='bg-white border-2 border-gray-300 rounded-md p-2 mt-2 h-12 flex-row items-center justify-center'
          onPress={handleGoogleSignUp}
        >
          <Text className='text-gray-700 text-center font-medium'>Continue with Google</Text>
        </Pressable>

        {/* Apple Sign Up - Only show on iOS */}
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={{ width: '100%', height: 48, marginTop: 8 }}
            onPress={handleAppleSignUp}
          />
        )}

        <View className='flex-row gap-2 items-center justify-center mt-6'>
          <Text className='text-gray-500'>Already have an account?</Text>
          <Link href="/sign_in">
            <Text className='text-blue-500 items-center justify-center my-1'>Sign in</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default sign_up