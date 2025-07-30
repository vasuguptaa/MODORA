import React from 'react';
import { Brain, BookOpen, Globe, Sparkles, Users } from 'lucide-react';
import { Interpretation } from '../../types';

interface InterpretationPanelProps {
  interpretations: Interpretation[];
}

const lensIcons = {
  therapist: Brain,
  philosophical: BookOpen,
  cultural: Globe,
  spiritual: Sparkles,
  sociological: Users,
};

const lensColors = {
  therapist: 'from-emerald-500 to-teal-600',
  philosophical: 'from-blue-500 to-indigo-600',
  cultural: 'from-orange-500 to-red-600',
  spiritual: 'from-purple-500 to-pink-600',
  sociological: 'from-amber-500 to-yellow-600',
};

const InterpretationPanel: React.FC<InterpretationPanelProps> = ({ interpretations }) => {
  return (
    <div className="border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4 flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>AI Interpretations</span>
        </h3>

        <div className="space-y-4">
          {interpretations.map((interpretation) => {
            const Icon = lensIcons[interpretation.lens];
            const gradientColor = lensColors[interpretation.lens];

            return (
              <div
                key={interpretation.id}
                className="bg-white dark:bg-stone-800 rounded-lg p-5 border border-stone-200 dark:border-stone-700 shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${gradientColor} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-medium text-stone-800 dark:text-stone-200 capitalize">
                    {interpretation.lens} Perspective
                  </h4>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
                  {interpretation.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterpretationPanel;