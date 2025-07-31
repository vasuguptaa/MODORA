const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const POSTS_FILE = path.join(__dirname, 'posts.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function to read posts from JSON file
async function readPosts() {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts file:', error);
    return { posts: [] };
  }
}

// Helper function to write posts to JSON file
async function writePosts(data) {
  try {
    await fs.writeFile(POSTS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing posts file:', error);
    return false;
  }
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Routes

// GET /api/posts - Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const data = await readPosts();
    res.json(data.posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:id - Get a specific post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const data = await readPosts();
    const post = data.posts.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts - Create a new post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, tags, lenses, isAnonymous, userId, username } = req.body;
    
    // Validation
    if (!content || !userId || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const data = await readPosts();
    
    const newPost = {
      id: generateId(),
      userId,
      username: isAnonymous ? 'Anonymous' : username,
      title: title || '',
      content,
      tags: tags || [],
      lenses: lenses || [],
      interpretations: [],
      comments: [],
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      isAnonymous: isAnonymous || false
    };
    
    data.posts.unshift(newPost); // Add to beginning of array
    await writePosts(data);
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/posts/:id - Update a post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, content, tags, lenses } = req.body;
    const data = await readPosts();
    
    const postIndex = data.posts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Update only provided fields
    if (title !== undefined) data.posts[postIndex].title = title;
    if (content !== undefined) data.posts[postIndex].content = content;
    if (tags !== undefined) data.posts[postIndex].tags = tags;
    if (lenses !== undefined) data.posts[postIndex].lenses = lenses;
    
    await writePosts(data);
    res.json(data.posts[postIndex]);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id - Delete a post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const data = await readPosts();
    const postIndex = data.posts.findIndex(p => p.id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    data.posts.splice(postIndex, 1);
    await writePosts(data);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// POST /api/posts/:id/upvote - Upvote a post
app.post('/api/posts/:id/upvote', async (req, res) => {
  try {
    const data = await readPosts();
    const post = data.posts.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.upvotes += 1;
    await writePosts(data);
    
    res.json({ upvotes: post.upvotes });
  } catch (error) {
    console.error('Error upvoting post:', error);
    res.status(500).json({ error: 'Failed to upvote post' });
  }
});

// POST /api/posts/:id/downvote - Downvote a post
app.post('/api/posts/:id/downvote', async (req, res) => {
  try {
    const data = await readPosts();
    const post = data.posts.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.downvotes += 1;
    await writePosts(data);
    
    res.json({ downvotes: post.downvotes });
  } catch (error) {
    console.error('Error downvoting post:', error);
    res.status(500).json({ error: 'Failed to downvote post' });
  }
});

// POST /api/posts/:id/comments - Add a comment to a post
app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const { content, userId, username, parentId } = req.body;
    
    if (!content || !userId || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const data = await readPosts();
    const post = data.posts.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const newComment = {
      id: generateId(),
      postId: req.params.id,
      userId,
      username,
      content,
      parentId: parentId || null,
      replies: [],
      upvotes: 0,
      downvotes: 0,
      reactions: [],
      toneBadges: [],
      createdAt: new Date().toISOString(),
      isPinned: false
    };
    
    post.comments.push(newComment);
    await writePosts(data);
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MODORA Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MODORA Backend server running on port ${PORT}`);
  console.log(`📝 Posts API: http://localhost:${PORT}/api/posts`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
}); 