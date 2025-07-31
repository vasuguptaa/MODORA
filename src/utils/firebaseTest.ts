import { auth, db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test Firestore connection
    await getDocs(collection(db, 'users'));
    console.log('✅ Firestore connection successful');
    
    // Test Auth connection
    const currentUser = auth.currentUser;
    console.log('✅ Auth connection successful, current user:', currentUser ? 'logged in' : 'not logged in');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};

export const logFirebaseConfig = () => {
  console.log('Firebase configuration check:');
  console.log('- Auth initialized:', !!auth);
  console.log('- Firestore initialized:', !!db);
  console.log('- Auth app:', auth.app.name);
  console.log('- Firestore app:', db.app.name);
}; 