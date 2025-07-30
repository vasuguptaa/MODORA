import React, { useState, useEffect } from 'react';
import { Brain, Eye, Heart, Lightbulb } from 'lucide-react';

const LoadingPage: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      icon: Eye,
      title: "See Your Story Through New Eyes",
      description: "Every experience can be understood from multiple perspectives. Open yourself to new insights."
    },
    {
      icon: Heart,
      title: "Share Authentically",
      description: "Your vulnerability creates space for genuine connection and meaningful interpretations."
    },
    {
      icon: Lightbulb,
      title: "Embrace Different Lenses",
      description: "Therapeutic, philosophical, cultural, spiritual, and sociological perspectives each offer unique wisdom."
    },
    {
      icon: Brain,
      title: "Trust the Process",
      description: "Sometimes the most profound insights come from unexpected angles. Stay curious."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tips.length]);

  const currentTipData = tips[currentTip];
  const Icon = currentTipData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800 flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md mx-auto text-center px-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Brain className="h-16 w-16 text-blue-600 mr-4" />
          <h1 className="text-5xl font-bold text-stone-800 dark:text-stone-100">
            MODORA
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl text-stone-600 dark:text-stone-400 italic mb-12">
          See Your Story Through New Eyes
        </p>

        {/* Animated Loading */}
        <div className="mb-12">
          <div className="flex justify-center space-x-2 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          <p className="text-stone-500 dark:text-stone-400">
            Preparing your experience...
          </p>
        </div>

        {/* Rotating Tips */}
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6 border border-stone-200 dark:border-stone-700 transition-all duration-500">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-3 transition-all duration-500">
            {currentTipData.title}
          </h3>
          
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed transition-all duration-500">
            {currentTipData.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTip
                    ? 'bg-blue-600 w-8'
                    : 'bg-stone-300 dark:bg-stone-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;