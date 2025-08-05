# React Native Side Menu Implementation

This implementation provides a comprehensive side menu solution for your React Native app using Expo Router.

## Components Overview

### 1. `SideMenuModal.tsx`
The main side menu component that displays as a modal overlay.

**Features:**
- User profile section with avatar and user info
- Navigation menu items with icons
- Logout functionality
- Responsive design with proper spacing

**Props:**
```typescript
interface SideMenuModalProps {
  visible: boolean;
  onClose: () => void;
}
```

### 2. `useSideMenu.ts`
Custom hook for managing side menu state.

**Returns:**
```typescript
{
  isSideMenuVisible: boolean;
  openSideMenu: () => void;
  closeSideMenu: () => void;
  toggleSideMenu: () => void;
}
```

### 3. `HamburgerMenu.tsx`
Hamburger menu button component.

**Props:**
```typescript
interface HamburgerMenuProps {
  onPress: () => void;
  size?: number;
  color?: string;
}
```

### 4. `HeaderWithMenu.tsx`
Header component with integrated hamburger menu.

**Props:**
```typescript
interface HeaderWithMenuProps {
  title?: string;
  showMenu?: boolean;
  rightComponent?: React.ReactNode;
}
```

## Installation

1. Install required dependencies:
```bash
npm install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

2. Import the components in your project.

## Usage Examples

### Basic Implementation

```tsx
import React from 'react';
import { View } from 'react-native';
import HeaderWithMenu from '@/components/HeaderWithMenu';
import SideMenuModal from '@/components/SideMenuModal';
import { useSideMenu } from '@/hooks/useSideMenu';

const MyScreen = () => {
  const { isSideMenuVisible, closeSideMenu } = useSideMenu();

  return (
    <View className="flex-1 bg-white">
      <HeaderWithMenu title="My Screen" />
      
      {/* Your screen content */}
      <View className="flex-1 p-4">
        <Text>Your content here</Text>
      </View>

      <SideMenuModal 
        visible={isSideMenuVisible} 
        onClose={closeSideMenu} 
      />
    </View>
  );
};
```

### Custom Header with Right Component

```tsx
import React from 'react';
import { Pressable, Text } from 'react-native';
import HeaderWithMenu from '@/components/HeaderWithMenu';

const MyScreen = () => {
  const rightComponent = (
    <Pressable onPress={() => console.log('Right button pressed')}>
      <Text>Settings</Text>
    </Pressable>
  );

  return (
    <View className="flex-1">
      <HeaderWithMenu 
        title="Custom Header" 
        rightComponent={rightComponent}
      />
      {/* Your content */}
    </View>
  );
};
```

### Manual Menu Control

```tsx
import React from 'react';
import { Pressable, Text } from 'react-native';
import HamburgerMenu from '@/components/HamburgerMenu';
import SideMenuModal from '@/components/SideMenuModal';
import { useSideMenu } from '@/hooks/useSideMenu';

const CustomScreen = () => {
  const { isSideMenuVisible, openSideMenu, closeSideMenu } = useSideMenu();

  return (
    <View className="flex-1">
      <View className="flex-row items-center p-4">
        <HamburgerMenu onPress={openSideMenu} />
        <Text className="text-lg font-semibold ml-3">Custom Layout</Text>
      </View>

      {/* Your content */}

      <SideMenuModal 
        visible={isSideMenuVisible} 
        onClose={closeSideMenu} 
      />
    </View>
  );
};
```

## Menu Items Configuration

The side menu includes the following default menu items:

```typescript
const menuItems = [
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
  // ... more items
];
```

## Customization

### Adding Custom Menu Items

To add custom menu items, modify the `menuItems` array in `SideMenuModal.tsx`:

```typescript
const menuItems: MenuItem[] = [
  // ... existing items
  {
    id: 'custom',
    title: 'Custom Screen',
    icon: '🎯',
    onPress: () => router.push('/custom-screen'),
  },
];
```

### Styling

The components use Tailwind CSS classes for styling. You can customize the appearance by modifying the className props.

### Icons

The menu uses emoji icons by default. You can replace them with custom icon components or icon fonts.

## Integration with Existing Navigation

This side menu implementation is designed to work alongside your existing Expo Router navigation structure. It doesn't replace your current navigation but adds an additional layer of navigation options.

## Best Practices

1. **State Management**: Use the `useSideMenu` hook consistently across your app
2. **Performance**: The side menu is rendered as a modal to avoid navigation conflicts
3. **Accessibility**: Ensure proper accessibility labels for screen readers
4. **Testing**: Test the menu on different screen sizes and orientations

## Troubleshooting

### Common Issues

1. **Menu not opening**: Ensure you're using the `useSideMenu` hook correctly
2. **Navigation conflicts**: The side menu uses modal presentation to avoid conflicts
3. **Styling issues**: Check that Tailwind CSS is properly configured

### Debug Tips

- Use console.log to debug menu state changes
- Check that all required dependencies are installed
- Verify that the GlobalContext is properly set up for user data

## API Reference

### useSideMenu Hook

```typescript
const {
  isSideMenuVisible,  // boolean
  openSideMenu,       // () => void
  closeSideMenu,      // () => void
  toggleSideMenu      // () => void
} = useSideMenu();
```

### SideMenuModal Props

```typescript
interface SideMenuModalProps {
  visible: boolean;    // Controls menu visibility
  onClose: () => void; // Callback when menu should close
}
```

### HeaderWithMenu Props

```typescript
interface HeaderWithMenuProps {
  title?: string;           // Header title
  showMenu?: boolean;       // Show/hide hamburger menu
  rightComponent?: React.ReactNode; // Custom right component
}
``` 