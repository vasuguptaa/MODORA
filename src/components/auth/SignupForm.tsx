import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface SignupFormProps {
  onToggleMode: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();

  // Validation states
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validation
    if (!email.trim() || !password.trim() || !username.trim()) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }
    
    if (!emailValid) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    
    if (!passwordValid) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }
    
    if (!usernameValid) {
      setError('Username must be 3-20 characters and contain only letters, numbers, and underscores.');
      setIsLoading(false);
      return;
    }
    
    try {
      await signup(email.trim(), password, username.trim());
    } catch (error: unknown) {
      console.error('Signup failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time validation
  useEffect(() => {
    setEmailValid(email.includes('@') && email.length > 5);
  }, [email]);

  useEffect(() => {
    setPasswordValid(password.length >= 6);
  }, [password]);

  useEffect(() => {
    setUsernameValid(
      username.length >= 3 && 
      username.length <= 20 && 
      /^[a-zA-Z0-9_]+$/.test(username)
    );
  }, [username]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && (email || password || username)) {
      setError('');
    }
  }, [email, password, username, error]);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-stone-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2">
          Join MODORA
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          Share your story, discover new perspectives
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 transition-colors ${
                username ? (usernameValid ? 'border-green-500' : 'border-red-500') : 'border-stone-300 dark:border-stone-600'
              }`}
              placeholder="Choose a username"
              required
            />
            {username && (
              <div className="absolute right-3 top-3">
                {usernameValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            This will be your pseudonymous identity (3-20 characters, letters, numbers, underscores only)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 transition-colors ${
                email ? (emailValid ? 'border-green-500' : 'border-red-500') : 'border-stone-300 dark:border-stone-600'
              }`}
              placeholder="Enter your email"
              required
            />
            {email && (
              <div className="absolute right-3 top-3">
                {emailValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 transition-colors ${
                password ? (passwordValid ? 'border-green-500' : 'border-red-500') : 'border-stone-300 dark:border-stone-600'
              }`}
              placeholder="Create a password (min 6 characters)"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-12 top-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            {password && (
              <div className="absolute right-3 top-3">
                {passwordValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !emailValid || !passwordValid || !usernameValid}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-stone-600 dark:text-stone-400">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;