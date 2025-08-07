import { Stack } from 'expo-router';

export default function UserDetailLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[user_id]" 
        options={{ 
          title: 'User Profile',
          headerShown: false,
          headerBackTitle: 'Back'
        }} 
      />
    </Stack>
  );
}
