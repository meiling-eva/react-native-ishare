# PostItem Components

This directory contains reusable components for displaying posts in different layouts.

## Components

### PostItem
A flexible, reusable component for displaying posts with different layouts.

**Props:**
- `item`: Post data object
- `isLiked`: Boolean indicating if the post is liked by the current user
- `onLikeChange`: Callback function when like status changes
- `layout`: Layout type - 'grid' (default) or 'list'
- `showLikeButton`: Boolean to show/hide like button (default: true)

**Usage Examples:**

```tsx
// Grid layout (2-column)
<PostItem 
  item={post}
  isLiked={isLiked}
  onLikeChange={handleLikeChange}
  layout="grid"
/>

// List layout (single column)
<PostItem 
  item={post}
  isLiked={isLiked}
  onLikeChange={handleLikeChange}
  layout="list"
/>

// Without like button
<PostItem 
  item={post}
  isLiked={isLiked}
  onLikeChange={handleLikeChange}
  showLikeButton={false}
/>
```

### PostGridItem
A specialized component for 2-column grid layout (used in index_all.tsx).

**Props:**
- `item`: Post data object
- `isLiked`: Boolean indicating if the post is liked by the current user
- `onLikeChange`: Callback function when like status changes

**Usage:**
```tsx
<PostGridItem 
  item={post}
  isLiked={isLiked}
  onLikeChange={handleLikeChange}
/>
```

## Features

- **LottieView Integration**: Automatic heart animation for like/unlike actions
- **Responsive Layouts**: Support for grid and list layouts
- **Navigation**: Automatic navigation to post detail on press
- **Like Functionality**: Built-in like/unlike with Appwrite integration
- **Loading States**: Proper animation states for liked/unliked posts

## Implementation in Screens

### index_all.tsx
```tsx
const handleLikeChange = (postId: string, isLiked: boolean) => {
  if (isLiked) {
    setLikedPosts(prev => [...prev, postId]);
  } else {
    setLikedPosts(prev => prev.filter(id => id !== postId));
  }
};

<FlatList 
  data={posts}
  numColumns={2}
  renderItem={({ item }) => {
    const isLiked = likedPosts.includes(item.$id);
    return (
      <PostGridItem 
        item={item}
        isLiked={isLiked}
        onLikeChange={handleLikeChange}
      />
    );
  }}
/>
```

### Other Screens
For other screens like `index_likes.tsx`, `index_follow.tsx`, etc., you can use the generic `PostItem` component with different layouts. 