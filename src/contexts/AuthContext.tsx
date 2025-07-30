import React, { createContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

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

  const initializeAuth = () => {
    console.log('AuthContext: Starting Firebase auth listener...');
    setError(null);
    setIsLoading(true);
    
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
  };

  const retryConnection = () => {
    initializeAuth();
  };

  useEffect(() => {
    const cleanup = initializeAuth();
    return cleanup;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
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

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, error, retryConnection }}>
      {children}
    </AuthContext.Provider>
  );
};