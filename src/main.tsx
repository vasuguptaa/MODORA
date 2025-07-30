import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testFirebaseConnection, logFirebaseConfig } from './utils/firebaseTest';

// Test Firebase connection on app start
if (process.env.NODE_ENV === 'development') {
  logFirebaseConfig();
  testFirebaseConnection().then(success => {
    console.log('Firebase connection test result:', success ? 'SUCCESS' : 'FAILED');
  });
}

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
