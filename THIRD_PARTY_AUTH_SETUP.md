# Third-Party Authentication Setup Guide

## Overview
This guide explains how to set up Google and Apple authentication for your React Native app using Expo and Appwrite.

## What's Been Implemented

### 1. Dependencies Installed
- `expo-auth-session`: For OAuth authentication flows
- `expo-crypto`: For cryptographic operations
- `expo-web-browser`: For web browser functionality
- `expo-apple-authentication`: For Apple Sign-In

**Note:** Google Sign-In uses Expo's built-in `expo-auth-session` instead of native modules for better compatibility.

### 2. Files Modified
- `lib/appwrite.ts`: Added Google and Apple authentication functions
- `app/(auth)/sign_in.tsx`: Added Google and Apple sign-in buttons
- `app/(auth)/sign_up.tsx`: Added Google and Apple sign-up buttons

### 3. UI Changes
- Added "Continue with Google" button on both sign-in and sign-up pages
- Added Apple Sign-In button (iOS only) on both pages
- Added visual dividers with "or" text between email/password and third-party options
- Buttons are styled consistently with the existing design

## Required Configuration

### Google Authentication Setup

1. **Google Cloud Console Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API and Google Sign-In API
   - Create OAuth 2.0 credentials:
     - Web client ID (for Expo)
     - iOS client ID (if building for iOS)
     - Android client ID (if building for Android)

2. **Update Configuration:**
   Replace the placeholder values in `lib/appwrite.ts`:
   ```typescript
   GoogleSignin.configure({
     webClientId: 'YOUR_ACTUAL_GOOGLE_WEB_CLIENT_ID',
     iosClientId: 'YOUR_ACTUAL_GOOGLE_IOS_CLIENT_ID',
   });
   ```

3. **Appwrite Setup:**
   - In your Appwrite console, go to Auth > Settings
   - Enable Google OAuth provider
   - Add your Google OAuth credentials

### Apple Authentication Setup

1. **Apple Developer Account:**
   - You need a paid Apple Developer account
   - Enable Sign In with Apple for your app identifier
   - Configure your app's bundle identifier

2. **Appwrite Setup:**
   - In your Appwrite console, go to Auth > Settings
   - Enable Apple OAuth provider
   - Configure Apple OAuth settings

3. **iOS Configuration:**
   - Apple Sign-In only works on iOS devices
   - The button automatically appears/disappears based on platform

### Expo Configuration

Add to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      "@react-native-google-signin/google-signin",
      "expo-apple-authentication"
    ],
    "ios": {
      "bundleIdentifier": "your.bundle.identifier",
      "usesAppleSignIn": true
    },
    "android": {
      "package": "your.package.name"
    }
  }
}
```

## How It Works

### Google Sign-In Flow:
1. User taps "Continue with Google"
2. Google Sign-In modal appears
3. User authenticates with Google
4. App receives ID token and user info
5. Creates/updates user in Appwrite database
6. Redirects to main app

### Apple Sign-In Flow:
1. User taps Apple Sign-In button (iOS only)
2. Apple authentication modal appears
3. User authenticates with Apple ID
4. App receives identity token and user info
5. Creates/updates user in Appwrite database
6. Redirects to main app

## Important Notes

### Current Implementation Status:
The authentication functions are implemented but may need adjustments based on your specific Appwrite OAuth configuration. The current implementation shows the structure and UI, but you may need to:

1. **Update OAuth Flow:** Adjust the `createOAuth2Session` calls to match your Appwrite setup
2. **Handle Redirects:** Configure proper redirect URLs for your app
3. **Error Handling:** Add more specific error handling for different authentication scenarios
4. **User Data Mapping:** Ensure user data from Google/Apple maps correctly to your user schema

### Testing:
- Google Sign-In can be tested on both iOS and Android
- Apple Sign-In only works on iOS devices and simulators
- Make sure to test on actual devices for production readiness

### Security Considerations:
- Never commit actual OAuth client IDs to version control
- Use environment variables or secure configuration management
- Implement proper session management and token refresh

## Next Steps

1. Replace placeholder OAuth credentials with actual values
2. Configure Appwrite OAuth providers
3. Test authentication flows on actual devices
4. Implement proper error handling and user feedback
5. Add logout functionality for third-party accounts
6. Consider implementing account linking if users sign in with different methods

## Troubleshooting

### Common Issues:
- **Google Sign-In not working:** Check client IDs and bundle identifiers
- **Apple Sign-In not appearing:** Ensure you're testing on iOS with proper configuration
- **Appwrite errors:** Verify OAuth provider settings in Appwrite console
- **Redirect issues:** Check redirect URLs in OAuth provider settings

For more detailed setup instructions, refer to:
- [Expo Google Sign-In docs](https://docs.expo.dev/guides/google-authentication/)
- [Expo Apple Authentication docs](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Appwrite OAuth docs](https://appwrite.io/docs/client/account#accountCreateOAuth2Session)
