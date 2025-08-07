import { Stack } from 'expo-router';

export default function DetailLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[post_id]" 
        options={{ 
          title: 'Post Detail',
          headerShown: false,
          headerBackTitle: 'Back',
        }} 
      />
    </Stack>
  );
}
