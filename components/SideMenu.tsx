import { useGlobalContext } from '@/context/GlobalContext';
import { logout } from '@/lib/appwrite';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  showDivider?: boolean;
}

const SideMenu = () => {
  const { user, setUser } = useGlobalContext();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              setUser(null as any);
              router.replace('/(auth)/sign_in');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      title: 'Home',
      icon: '🏠',
      onPress: () => router.push('/(tabs)'),
    },
    {
      id: 'profile',
      title: 'My Profile',
      icon: '👤',
      onPress: () => router.push('/(tabs)/profile_user'),
    },
    {
      id: 'likes',
      title: 'My Likes',
      icon: '❤️',
      onPress: () => router.push('/(tabs)/index_likes'),
    },
    {
      id: 'posts',
      title: 'My Posts',
      icon: '📝',
      onPress: () => router.push('/(tabs)/index_userposts'),
      showDivider: true,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      onPress: () => {
        // TODO: Navigate to settings screen
        Alert.alert('Settings', 'Settings screen coming soon!');
      },
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: '❓',
      onPress: () => {
        // TODO: Navigate to help screen
        Alert.alert('Help', 'Help & Support screen coming soon!');
      },
    },
    {
      id: 'about',
      title: 'About',
      icon: 'ℹ️',
      onPress: () => {
        Alert.alert(
          'About iShare',
          'iShare - Share your moments with the world!\n\nVersion 1.0.0'
        );
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* User Profile Section */}
        <View className="p-6 border-b border-gray-200">
          <Pressable
            onPress={() => router.push('/(tabs)/profile_user')}
            className="flex-row items-center"
          >
            <Image
              source={{
                uri: user?.avatar_url && user.avatar_url.trim() !== ''
                  ? user.avatar_url
                  : 'https://via.placeholder.com/60x60?text=U'
              }}
              className="w-15 h-15 rounded-full"
            />
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-black">
                {user?.username || 'Guest User'}
              </Text>
              <Text className="text-sm text-gray-500">
                {user?.email || 'Not signed in'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Menu Items */}
        <View className="py-2">
          {menuItems.map((item) => (
            <View key={item.id}>
              <Pressable
                onPress={item.onPress}
                className="flex-row items-center px-6 py-4 active:bg-gray-100"
              >
                <Text className="text-xl mr-4">{item.icon}</Text>
                <Text className="text-base text-black flex-1">{item.title}</Text>
                <Text className="text-gray-400">›</Text>
              </Pressable>
              {item.showDivider && (
                <View className="h-px bg-gray-200 mx-6" />
              )}
            </View>
          ))}
        </View>

        {/* Logout Section */}
        {user && (
          <View className="mt-6 px-6">
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center py-4 active:bg-red-50 rounded-lg"
            >
              <Text className="text-xl mr-4">🚪</Text>
              <Text className="text-base text-red-600 font-medium">Logout</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View className="p-6 border-t border-gray-200">
        <Text className="text-xs text-gray-400 text-center">
          iShare © 2024
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SideMenu; 