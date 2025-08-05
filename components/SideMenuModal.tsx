import { useGlobalContext } from '@/context/GlobalContext';
import { logout } from '@/lib/appwrite';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface SideMenuModalProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  showDivider?: boolean;
  isSideMenuVisible?: boolean;
}

const SideMenuModal = ({ visible, onClose }: SideMenuModalProps) => {
  const { user, setUser, toggleSideMenu } = useGlobalContext();
  const slideAnim = useRef(new Animated.Value(-320)).current; // Start off-screen to the left
  const { isSideMenuVisible } = useGlobalContext();

  useEffect(() => {
    if (visible) {
      // Slide out from left (menu appears from left)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide back to left (menu disappears to left)
      Animated.timing(slideAnim, {
        toValue: -320,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

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
              onClose();
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

  const handleMenuItemPress = (onPress: () => void) => {
    onPress();
    // Close the side menu immediately
    onClose();
  };

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      title: 'Home',
      icon: '🏠',
      onPress: () => router.push('/(tabs)'),
    },
    ...(user ? [
      {
        id: 'profile',
        title: 'My Profile',
        icon: '👤',
        onPress: () => router.push('/(tabs)/profile_user'),
      },
    ] : [
      {
        id: 'login',
        title: 'Sign In',
        icon: '🔑',
        onPress: () => router.push('/(auth)/sign_in'),
      }
    ]),
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      onPress: () => {
        Alert.alert('Settings', 'Settings screen coming soon!');
      },
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: '❓',
      onPress: () => {
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
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={onClose}
        presentationStyle="overFullScreen"
      >
      <Animated.View 
        className="flex-1 flex-row"
        style={{
          transform: [{ translateX: slideAnim }],
        }}
      >
        {/* Side Menu - Positioned on the left */}
        <View 
          className="w-80 bg-white h-full shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <SafeAreaView className="flex-1">
            <ScrollView className="flex-1">
              {/* User Profile Section */}
              <View className="p-6 border-b border-gray-200">
                <Pressable
                  onPress={() => handleMenuItemPress(() => 
                    user && user.user_id && user.user_id.trim() !== '' ? router.push('/(tabs)/profile_user') : router.push('/(auth)/sign_in')
                  )}
                  className="flex-row items-center"
                >
                  <Image
                    source={{
                      uri: user?.avatar_url && user.avatar_url.trim() !== ''
                        ? user.avatar_url
                        : 'https://via.placeholder.com/60x60?text=G'
                    }}
                    className="w-15 h-15 rounded-full"
                  />
                  <View className="ml-4 flex-1">
                    <Text className="text-lg font-semibold text-black">
                      {user?.username || 'Guest User'}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {user?.email || 'Tap to sign in'}
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* Menu Items */}
              <View className="py-2">
                {menuItems.map((item) => (
                  <View key={item.id}>
                    <Pressable
                      onPress={() => handleMenuItemPress(item.onPress)}
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
                iShare © 2025
              </Text>
            </View>
          </SafeAreaView>
        </View>

        {/* Overlay - Now slides with the menu */}
        <Pressable
          className="flex-1"
          onPress={onClose}
          style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
          android_ripple={{ color: 'transparent' }}
        />
      </Animated.View>
    </Modal>
  );
};

export default SideMenuModal; 