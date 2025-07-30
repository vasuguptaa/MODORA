import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Brain, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white dark:bg-stone-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Moon className="h-5 w-5 text-stone-600" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100">
                MODORA
              </h1>
            </div>
            <p className="text-lg text-stone-600 dark:text-stone-400 italic">
              See Your Story Through New Eyes
            </p>
          </div>

          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <SignupForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;