import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  AuthError,
  AuthErrorCodes
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case AuthErrorCodes.USER_DELETED:
      return 'No account found with this email address.';
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'Incorrect password. Please try again.';
    case AuthErrorCodes.EMAIL_EXISTS:
      return 'An account with this email already exists.';
    case AuthErrorCodes.WEAK_PASSWORD:
      return 'Password should be at least 6 characters long.';
    case AuthErrorCodes.INVALID_EMAIL:
      return 'Please enter a valid email address.';
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'Too many failed attempts. Please try again later.';
    case AuthErrorCodes.NETWORK_REQUEST_FAILED:
      return 'Network error. Please check your internet connection.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  retryConnection: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we're using mock Firebase (development mode)
  const isUsingMockFirebase = import.meta.env.DEV && 
    (!import.meta.env.VITE_FIREBASE_API_KEY || 
     import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here');

  const initializeAuth = useCallback(() => {
    console.log('AuthContext: Starting Firebase auth listener...');
    setError(null);
    setIsLoading(true);
    
    // If using mock Firebase, skip Firebase auth and set a demo user
    if (isUsingMockFirebase) {
      console.log('AuthContext: Using mock Firebase - setting demo user');
      const demoUser: User = {
        id: 'demo-user-id',
        uid: 'demo-user-id',
        email: 'demo@example.com',
        username: 'DemoUser',
        displayName: 'Demo User',
        photoURL: undefined,
        reputationScore: 100,
        createdAt: new Date(),
      };
      setUser(demoUser);
      setIsLoading(false);
      return () => {};
    }
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('AuthContext: Timeout reached, setting isLoading to false');
      setIsLoading(false);
      setError('Connection timeout. Please check your internet connection.');
    }, 10000); // 10 second timeout
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext: Firebase auth state changed:', firebaseUser ? 'User logged in' : 'No user');
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      try {
        if (firebaseUser) {
          console.log('AuthContext: Fetching user data from Firestore...');
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            console.log('AuthContext: User data found in Firestore');
            setUser({
              ...userData,
              uid: firebaseUser.uid,
              email: firebaseUser.email || userData.email,
              displayName: firebaseUser.displayName ?? undefined,
              photoURL: firebaseUser.photoURL ?? undefined,
            });
          } else {
            console.log('AuthContext: Creating new user document in Firestore...');
            // Create new user document if it doesn't exist
            const newUser: User = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: firebaseUser.displayName || `user_${Math.random().toString(36).substr(2, 5)}`,
              displayName: firebaseUser.displayName ?? undefined,
              photoURL: firebaseUser.photoURL ?? undefined,
              reputationScore: 0,
              createdAt: new Date(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
            console.log('AuthContext: New user document created');
          }
        } else {
          console.log('AuthContext: No user, setting user to null');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext: Error in auth state change:', error);
        // Set user to null on error to prevent infinite loading
        setUser(null);
        setError('Failed to connect to our services. Please try again.');
      } finally {
        console.log('AuthContext: Setting isLoading to false');
        setIsLoading(false);
      }
    });

    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [isUsingMockFirebase]);

  const retryConnection = () => {
    initializeAuth();
  };

  useEffect(() => {
    const cleanup = initializeAuth();
    return cleanup;
  }, [initializeAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If using mock Firebase, allow demo login
      if (isUsingMockFirebase) {
        console.log('AuthContext: Demo login with mock Firebase');
        const demoUser: User = {
          id: 'demo-user-id',
          uid: 'demo-user-id',
          email: email,
          username: email.split('@')[0],
          displayName: email.split('@')[0],
          photoURL: undefined,
          reputationScore: 100,
          createdAt: new Date(),
        };
        setUser(demoUser);
        return;
      }
      
      // Validate input
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Login successful');
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        if ('code' in error) {
          // Firebase Auth error
          throw new Error(getAuthErrorMessage(error as AuthError));
        } else {
          // Custom validation error
          throw error;
        }
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If using mock Firebase, allow demo signup
      if (isUsingMockFirebase) {
        console.log('AuthContext: Demo signup with mock Firebase');
        const demoUser: User = {
          id: 'demo-user-id',
          uid: 'demo-user-id',
          email: email,
          username: username,
          displayName: username,
          photoURL: undefined,
          reputationScore: 0,
          createdAt: new Date(),
        };
        setUser(demoUser);
        return;
      }
      
      // Validate input
      if (!email || !password || !username) {
        throw new Error('Please fill in all fields.');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters long.');
      }
      
      if (username.length > 20) {
        throw new Error('Username must be less than 20 characters.');
      }
      
      // Check if username contains only alphanumeric characters and underscores
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username can only contain letters, numbers, and underscores.');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile with username
      await updateProfile(firebaseUser, {
        displayName: username
      });

      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        username,
        displayName: username,
        photoURL: firebaseUser.photoURL ?? undefined,
        reputationScore: 0,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
      });
      
      console.log('AuthContext: Signup successful');
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof Error) {
        if ('code' in error) {
          // Firebase Auth error
          throw new Error(getAuthErrorMessage(error as AuthError));
        } else {
          // Custom validation error
          throw error;
        }
      } else {
        throw new Error('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isUsingMockFirebase) {
        console.log('AuthContext: Demo logout with mock Firebase');
        setUser(null);
        return;
      }
      await signOut(auth);
      console.log('AuthContext: Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, we should clear the local user state
      setUser(null);
      throw new Error('Logout failed. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, error, retryConnection }}>
      {children}
    </AuthContext.Provider>
  );
};