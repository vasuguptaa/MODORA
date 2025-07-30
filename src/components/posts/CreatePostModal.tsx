import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Brain, Tag, Globe, AlertCircle } from 'lucide-react';
import { InterpretationLens } from '../../types';

interface PostData {
  title: string;
  content: string;
  lenses: InterpretationLens[];
  tags: string[];
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: PostData) => Promise<void>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    lenses: [] as InterpretationLens[],
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const lensOptions = [
    { id: 'therapist' as InterpretationLens, label: 'Therapist', description: 'Professional therapeutic perspective' },
    { id: 'philosophical' as InterpretationLens, label: 'Philosophical', description: 'Wisdom traditions and philosophical insights' },
    { id: 'cultural' as InterpretationLens, label: 'Cultural', description: 'Cross-cultural and anthropological views' },
    { id: 'spiritual' as InterpretationLens, label: 'Spiritual', description: 'Spiritual and metaphysical understanding' },
    { id: 'sociological' as InterpretationLens, label: 'Sociological', description: 'Social dynamics and structures' },
  ];

  const suggestedTags = [
    'transition', 'relationships', 'work', 'identity', 'family', 'growth',
    'anxiety', 'decision', 'conflict', 'change', 'purpose', 'healing'
  ];

  const handleLensToggle = (lens: InterpretationLens) => {
    setPostData(prev => ({
      ...prev,
      lenses: prev.lenses.includes(lens)
        ? prev.lenses.filter(l => l !== lens)
        : prev.lenses.length < 5
        ? [...prev.lenses, lens]
        : prev.lenses
    }));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !postData.tags.includes(tag)) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.toLowerCase()]
      }));
    }
    setNewTag('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit(postData);
      onClose();
      setStep(1);
      setPostData({ title: '', content: '', lenses: [], tags: [] });
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">
              Create Post
            </h2>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    stepNum <= step
                      ? 'bg-purple-600'
                      : 'bg-stone-300 dark:bg-stone-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200 mb-4">
                  Describe Your Experience
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4">
                  Share what's on your mind. Be as detailed as you feel comfortable.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={postData.title}
                  onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                  placeholder="Give your experience a title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Your Experience
                </label>
                <textarea
                  value={postData.content}
                  onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 resize-none"
                  rows={8}
                  placeholder="Share your experience, thoughts, and feelings. What's the situation? What emotions are you experiencing? What questions do you have?"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200 mb-4">
                  Choose Interpretation Lenses
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4">
                  Select up to 5 perspectives you'd like to see your experience through.
                </p>
              </div>

              <div className="grid gap-4">
                {lensOptions.map((lens) => (
                  <button
                    key={lens.id}
                    onClick={() => handleLensToggle(lens.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      postData.lenses.includes(lens.id)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                        : 'border-stone-200 dark:border-stone-600 hover:border-purple-300 dark:hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-stone-800 dark:text-stone-200">
                          {lens.label}
                        </h4>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                          {lens.description}
                        </p>
                      </div>
                      {postData.lenses.includes(lens.id) && (
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-sm text-stone-500 dark:text-stone-400">
                Selected: {postData.lenses.length}/5
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200 mb-4">
                  Add Tags
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mb-4">
                  Help others find your post with relevant tags.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Add a tag
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(newTag))}
                    className="flex-1 px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                    placeholder="Enter a tag..."
                  />
                  <button
                    onClick={() => handleAddTag(newTag)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Tag className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Current Tags */}
              {postData.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Your tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {postData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => setPostData(prev => ({
                            ...prev,
                            tags: prev.tags.filter(t => t !== tag)
                          }))}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Tags */}
              <div>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Suggested tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.filter(tag => !postData.tags.includes(tag)).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      className="px-3 py-1 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full text-sm hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200 mb-4">
                  Review & Submit
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mb-6">
                  Your post will be shared anonymously and interpreted through the selected lenses.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg p-4 space-y-4">
                {postData.title && (
                  <div>
                    <h4 className="font-medium text-stone-800 dark:text-stone-200 mb-2">Title:</h4>
                    <p className="text-stone-700 dark:text-stone-300">{postData.title}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-stone-800 dark:text-stone-200 mb-2">Content:</h4>
                  <p className="text-stone-700 dark:text-stone-300 text-sm line-clamp-4">
                    {postData.content}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-stone-800 dark:text-stone-200 mb-2">Lenses:</h4>
                  <div className="flex flex-wrap gap-2">
                    {postData.lenses.map((lens) => (
                      <span
                        key={lens}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-lg capitalize"
                      >
                        {lens}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-stone-800 dark:text-stone-200 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {postData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Anonymous Posting
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Your post will be shared with a pseudonymous username. Your real identity remains private.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-stone-200 dark:border-stone-700">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="flex items-center space-x-2 px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{step > 1 ? 'Back' : 'Cancel'}</span>
          </button>

          <div className="flex items-center space-x-3">
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !postData.content.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{isSubmitting ? 'Creating Post...' : 'Submit Anonymously'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;