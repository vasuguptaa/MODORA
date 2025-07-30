import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import FirebaseErrorFallback from './components/FirebaseErrorFallback';
import AuthPage from './components/auth/AuthPage';
import LoadingPage from './components/layout/LoadingPage';
import Navbar from './components/layout/Navbar';
import PostFeed from './components/feed/PostFeed';
import CreatePostModal from './components/posts/CreatePostModal';
import { Category } from './types';

interface PostData {
  title?: string;
  content: string;
  tags: string[];
  lenses: string[];
}

interface WindowWithAddNewPost extends Window {
  addNewPost?: (postData: PostData) => void;
}

const AppContent: React.FC = () => {
  const { user, isLoading, error, retryConnection } = useAuth();
  const [showLoading, setShowLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    // Only show the 2-second loading animation when user logs in
    if (user && !isLoading) {
      setShowLoading(true);
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (!isLoading) {
      // If not loading and no user, make sure loading is false
      setShowLoading(false);
    }
  }, [user, isLoading]);

  const handleCreatePost = async (postData: PostData) => {
    // This will be handled by the PostFeed component
    const windowWithAddNewPost = window as WindowWithAddNewPost;
    if (windowWithAddNewPost.addNewPost) {
      await windowWithAddNewPost.addNewPost(postData);
    }
  };

  // Show Firebase error fallback if there's a connection error
  if (error && !isLoading) {
    return <FirebaseErrorFallback error={error} onRetry={retryConnection} />;
  }

  // Show loading page while Firebase is initializing
  if (isLoading) {
    return <LoadingPage />;
  }

  // Show auth page if no user
  if (!user) {
    return <AuthPage />;
  }

  // Show loading animation after successful login
  if (showLoading) {
    return <LoadingPage />;
  }

  // Show main app
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <Navbar onCreatePost={() => setShowCreatePost(true)} />
      
      <PostFeed
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;