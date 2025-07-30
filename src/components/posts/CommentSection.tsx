import React, { useState } from 'react';
import { Send, ThumbsUp, Reply, Flag, AlertCircle } from 'lucide-react';
import { Comment } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'relevant' | 'upvoted' | 'thoughtful'>('relevant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // TODO: Implement Firebase comment creation
      // For now, just log the comment
      console.log('Submitting comment for post:', postId, 'Content:', newComment);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/30">
      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Sort by:</span>
          {(['relevant', 'upvoted', 'thoughtful'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`text-sm px-3 py-1 rounded-lg transition-colors capitalize ${
                sortBy === option
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your perspective..."
              className="w-full resize-none border-none outline-none bg-transparent text-stone-800 dark:text-stone-200 placeholder-stone-500 dark:placeholder-stone-400"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-200 dark:border-stone-700">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Tone badges will be automatically detected
                </span>
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Posting...' : 'Comment'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500 dark:text-stone-400">
                No comments yet. Be the first to share your perspective.
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg p-4 border border-stone-200 dark:border-stone-700">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">
              {comment.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-stone-800 dark:text-stone-200 text-sm">
                {comment.username}
              </p>
              {comment.toneBadges.map((badge, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
        <button className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
          <Flag className="h-4 w-4" />
        </button>
      </div>

      {/* Comment Content */}
      <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed mb-3">
        {comment.content}
      </p>

      {/* Comment Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Voting */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setUserVote(userVote === 'up' ? null : 'up')}
              className={`p-1 rounded transition-colors ${
                userVote === 'up'
                  ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                  : 'text-stone-500 hover:text-green-600'
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <span className="text-xs text-stone-600 dark:text-stone-400">
              {comment.upvotes - comment.downvotes}
            </span>
          </div>

          {/* Reactions */}
          <div className="flex items-center space-x-1">
            {comment.reactions.map((reaction, index) => (
              <button
                key={index}
                className="text-sm hover:scale-110 transition-transform"
                title={reaction.type}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>

          {/* Reply */}
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center space-x-1"
          >
            <Reply className="h-3 w-3" />
            <span>Reply</span>
          </button>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700">
          <div className="flex space-x-3">
            <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-xs">You</span>
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Write a thoughtful reply..."
                className="w-full text-sm border border-stone-200 dark:border-stone-600 rounded-lg p-2 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 placeholder-stone-500 dark:placeholder-stone-400 resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4 pl-8 space-y-3 border-l-2 border-stone-200 dark:border-stone-700">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;