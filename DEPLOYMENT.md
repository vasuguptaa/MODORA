# Netlify Deployment Guide for MODORA

## Prerequisites
- Netlify account
- Firebase project configured
- Git repository with your code

## Step 1: Environment Variables Setup

In your Netlify dashboard, go to **Site settings > Environment variables** and add the following:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 2: Firebase Security Rules

Make sure your Firestore security rules allow read/write access:

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
    }
  }
}
```

## Step 3: Netlify Build Settings

The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18
- Client-side routing redirects

## Step 4: Deploy to Netlify

### Option A: Deploy from Git
1. Connect your Git repository to Netlify
2. Netlify will automatically detect the build settings
3. Deploy!

### Option B: Manual Deploy
1. Run `npm run build` locally
2. Upload the `dist` folder to Netlify

## Step 5: Custom Domain (Optional)
1. Go to **Domain settings** in Netlify
2. Add your custom domain
3. Configure DNS settings

## Troubleshooting

### Build Failures
- Check Node.js version (should be 18+)
- Verify all environment variables are set
- Check Firebase project configuration

### Runtime Errors
- Verify Firebase security rules
- Check browser console for errors
- Ensure Firebase project is active

### Authentication Issues
- Verify Firebase Authentication is enabled
- Check authorized domains in Firebase console
- Add your Netlify domain to authorized domains

## Performance Optimization

The build includes warnings about large chunks. Consider:
- Code splitting with dynamic imports
- Lazy loading components
- Optimizing bundle size

## Security Notes

- Firebase API keys are safe to expose in client-side code
- Security is handled by Firebase security rules
- Environment variables are for configuration flexibility 