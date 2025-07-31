import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Check if we're in development and don't have real Firebase credentials
const isDevelopment = import.meta.env.DEV;
const hasRealCredentials = import.meta.env.VITE_FIREBASE_API_KEY && 
                          import.meta.env.VITE_FIREBASE_API_KEY !== 'your_api_key_here';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isDevelopment && !hasRealCredentials) {
  console.warn('⚠️ Firebase: Using mock configuration. Please set up your Firebase credentials in .env file for full functionality.');
  
  // Use mock config for development
  const firebaseConfig = {
    apiKey: "mock-api-key-for-development",
    authDomain: "mock-project.firebaseapp.com",
    projectId: "mock-project",
    storageBucket: "mock-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "mock-app-id",
    measurementId: "mock-measurement-id"
  };
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Use real Firebase configuration
  const realFirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  app = initializeApp(realFirebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
export default app; 