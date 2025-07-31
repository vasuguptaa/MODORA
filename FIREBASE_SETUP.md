# Firebase Setup Guide for MODORA

This guide will help you set up Firebase for the MODORA application with proper authentication and database configuration.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "modora-app")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## Step 3: Create Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 4: Set Up Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read posts
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow authenticated users to read and write comments
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "modora-web")
6. Copy the Firebase configuration object

## Step 6: Set Up Environment Variables

1. Create a `.env` file in your project root
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Replace the placeholder values with your actual Firebase configuration.

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Try to sign up with a new account
3. Check the Firebase Console to see if the user was created
4. Try logging in with the created account

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/user-not-found)"**
   - Make sure Email/Password authentication is enabled
   - Check that the user exists in Firebase Console

2. **"Firebase: Error (auth/wrong-password)"**
   - Verify the password is correct
   - Check if the user account exists

3. **"Firebase: Error (auth/email-already-in-use)"**
   - The email is already registered
   - Use a different email or try logging in instead

4. **"Firebase: Error (auth/weak-password)"**
   - Password must be at least 6 characters long
   - Add more complexity to the password

5. **"Firebase: Error (auth/invalid-email)"**
   - Make sure the email format is valid
   - Check for typos in the email address

### Development vs Production

- In development, the app will use mock Firebase if no environment variables are set
- In production, make sure all Firebase environment variables are properly configured
- Test authentication flows in both development and production environments

## Security Best Practices

1. **Never commit your `.env` file** to version control
2. **Use environment variables** for all Firebase configuration
3. **Set up proper Firestore security rules** before going to production
4. **Enable Firebase App Check** for additional security
5. **Monitor authentication attempts** in Firebase Console
6. **Set up proper CORS settings** if needed

## Deployment

When deploying to platforms like Netlify, Vercel, or Firebase Hosting:

1. Set the environment variables in your hosting platform's dashboard
2. Make sure the domain is added to authorized domains in Firebase Console
3. Test authentication after deployment
4. Monitor for any authentication errors

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify Firebase configuration in the console
3. Check Firebase Console for authentication logs
4. Ensure all environment variables are set correctly
5. Test with a fresh browser session 