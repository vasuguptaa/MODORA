import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Menu, X, AlertCircle } from 'lucide-react';
import { Category, Post, InterpretationLens } from '../../types';
import { mockPosts, generateMockInterpretations } from '../../data/mockData';
import { createPost, getPosts } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import PostCard from '../posts/PostCard';
import Sidebar from '../layout/Sidebar';

interface PostFeedProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
}

interface PostData {
  title?: string;
  content: string;
  tags: string[];
  lenses: string[];
}

interface WindowWithAddNewPost extends Window {
  addNewPost?: (postData: PostData) => void;
}

const PostFeed: React.FC<PostFeedProps> = ({ selectedCategory, onCategorySelect }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Fetch posts from Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError('');
        const fetchedPosts = await getPosts(selectedCategory || undefined);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again.');
        // Fallback to mock data if Firebase fails
        setPosts(mockPosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  const addNewPost = useCallback(async (postData: PostData) => {
    if (!user) {
      setError('You must be logged in to create a post.');
      return;
    }

    setError('');

    try {
      const userId = user.uid || user.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const newPost = await createPost({
        ...postData,
        userId,
        username: user.username,
      });

      // Add mock interpretations for now (in real app, this would be AI-generated)
      const postWithInterpretations: Post = {
        ...newPost,
        lenses: postData.lenses as InterpretationLens[],
        interpretations: generateMockInterpretations(postData.lenses as InterpretationLens[]),
        createdAt: newPost.createdAt instanceof Date ? newPost.createdAt : new Date(newPost.createdAt.seconds * 1000),
      };

      setPosts(prev => [postWithInterpretations, ...prev]);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      // setIsCreatingPost(false); // This line was removed
    }
  }, [user]);

  // Expose addNewPost function to parent component
  useEffect(() => {
    const windowWithAddNewPost = window as WindowWithAddNewPost;
    windowWithAddNewPost.addNewPost = addNewPost;
  }, [addNewPost]);

  // Filter posts based on selected category
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.tags.some(tag => 
        tag.toLowerCase().includes(selectedCategory.replace('-', ' '))
      ))
    : posts;

  return (
    <div className="flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="w-64 h-full bg-white dark:bg-stone-800">
            <div className="p-4 border-b border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar
              selectedCategory={selectedCategory}
              onCategorySelect={(category) => {
                onCategorySelect(category);
                setIsSidebarOpen(false);
              }}
              isCollapsed={false}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          isCollapsed={false}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen bg-stone-50 dark:bg-stone-900">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-stone-500" />
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {selectedCategory 
                  ? selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  : 'All Posts'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-2">
              {selectedCategory 
                ? selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                : 'Latest Posts'
              }
            </h1>
            <p className="text-stone-600 dark:text-stone-400">
              Discover new perspectives on shared experiences
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-stone-600 dark:text-stone-400">Loading posts...</span>
                </div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-600 dark:text-stone-400 mb-4">
                  {selectedCategory 
                    ? `No posts found in ${selectedCategory.replace('-', ' ')} category.`
                    : 'No posts yet. Be the first to share your story!'
                  }
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => onCategorySelect(null)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    View all posts
                  </button>
                )}
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>

          {/* Load more button */}
          {filteredPosts.length > 0 && !isLoading && (
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                Load More Posts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostFeed;