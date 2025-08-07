import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="sign_in" 
        options={{ 
          title: 'Sign In',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="sign_up" 
        options={{ 
          title: 'Sign Up',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
