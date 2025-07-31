import { Post, Category } from '../types';

const API_BASE_URL = 'http://localhost:4000/api';

export const createPost = async (postData: {
  title?: string;
  content: string;
  tags: string[];
  lenses: string[];
  userId: string;
  username: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...postData,
        isAnonymous: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    const newPost = await response.json();
    return {
      ...newPost,
      createdAt: new Date(newPost.createdAt),
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async (category?: Category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts: Post[] = await response.json();
    
    // Filter by category if specified
    if (category) {
      return posts.filter(post => 
        post.tags.some(tag => 
          tag.toLowerCase().includes(category.replace('-', ' '))
        )
      );
    }

    return posts.map(post => ({
      ...post,
      createdAt: new Date(post.createdAt),
    }));
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

export const upvotePost = async (postId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upvote post');
    }

    return await response.json();
  } catch (error) {
    console.error('Error upvoting post:', error);
    throw error;
  }
};

export const downvotePost = async (postId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/downvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to downvote post');
    }

    return await response.json();
  } catch (error) {
    console.error('Error downvoting post:', error);
    throw error;
  }
}; 