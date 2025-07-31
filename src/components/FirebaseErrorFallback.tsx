import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

interface FirebaseErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
}

const FirebaseErrorFallback: React.FC<FirebaseErrorFallbackProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-8 border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-center mb-6">
            <WifiOff className="h-16 w-16 text-orange-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-4">
            Connection Issue
          </h1>
          
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            We're having trouble connecting to our services. This might be due to:
          </p>
          
          <ul className="text-left text-sm text-stone-600 dark:text-stone-400 mb-6 space-y-2">
            <li>• Internet connection issues</li>
            <li>• Firebase service temporarily unavailable</li>
            <li>• Browser compatibility issues</li>
          </ul>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Try Again</span>
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 px-6 py-3 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseErrorFallback; 