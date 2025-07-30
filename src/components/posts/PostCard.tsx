import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronUp, 
  ChevronDown, 
  MessageCircle, 
  Share2, 
  Flag,
  Brain,
  Eye
} from 'lucide-react';
import { Post } from '../../types';
import { upvotePost, downvotePost } from '../../services/postService';
import CommentSection from './CommentSection';
import InterpretationPanel from './InterpretationPanel';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [showInterpretations, setShowInterpretations] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(post.upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(post.downvotes);

  const handleVote = async (type: 'up' | 'down') => {
    if (isVoting) return; // Prevent multiple rapid clicks
    
    setIsVoting(true);
    const previousVote = userVote;
    
    try {
      if (type === 'up') {
        await upvotePost(post.id);
        setLocalUpvotes(prev => prev + 1);
      } else {
        await downvotePost(post.id);
        setLocalDownvotes(prev => prev + 1);
      }
      
      // Update user vote state
      if (previousVote === type) {
        setUserVote(null);
      } else {
        setUserVote(type);
      }
    } catch (error) {
      console.error('Error voting:', error);
      // Revert local changes on error
      if (type === 'up') {
        setLocalUpvotes(post.upvotes);
      } else {
        setLocalDownvotes(post.downvotes);
      }
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700 transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {post.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-stone-800 dark:text-stone-200">
                {post.username}
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
          <button className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
            <Flag className="h-5 w-5" />
          </button>
        </div>

        {/* Title */}
        {post.title && (
          <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-3">
            {post.title}
          </h2>
        )}

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-4">
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Interpretation Lenses */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.lenses.map((lens, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-lg"
            >
              <Brain className="h-3 w-3" />
              <span className="capitalize">{lens}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-700">
          <div className="flex items-center space-x-4">
            {/* Voting */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={`p-1 rounded transition-colors ${
                  userVote === 'up'
                    ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                    : 'text-stone-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronUp className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-stone-600 dark:text-stone-400 min-w-[2rem] text-center">
                {localUpvotes - localDownvotes}
              </span>
              <button
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={`p-1 rounded transition-colors ${
                  userVote === 'down'
                    ? 'text-red-600 bg-red-100 dark:bg-red-900/20'
                    : 'text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>

            {/* View Interpretations */}
            <button
              onClick={() => setShowInterpretations(!showInterpretations)}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>View Interpretations</span>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
                {post.interpretations.length}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comments</span>
              <span className="text-xs bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded-full">
                {post.comments.length}
              </span>
            </button>
          </div>

          <button className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Interpretations Panel */}
      {showInterpretations && (
        <InterpretationPanel interpretations={post.interpretations} />
      )}

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={post.comments}
        />
      )}
    </div>
  );
};

export default PostCard;