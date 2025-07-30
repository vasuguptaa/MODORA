import React from 'react';
import { 
  Briefcase, 
  Heart, 
  Users, 
  Church, 
  UserCheck, 
  Flower, 
  TrendingUp, 
  Brain,
  Zap,
  Filter
} from 'lucide-react';
import { Category } from '../../types';

interface SidebarProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
  isCollapsed: boolean;
}

const categories = [
  { id: 'work' as Category, label: 'Work', icon: Briefcase, color: 'text-blue-600' },
  { id: 'parenting' as Category, label: 'Parenting', icon: Heart, color: 'text-pink-600' },
  { id: 'identity' as Category, label: 'Identity', icon: UserCheck, color: 'text-purple-600' },
  { id: 'religion' as Category, label: 'Religion', icon: Church, color: 'text-amber-600' },
  { id: 'relationships' as Category, label: 'Relationships', icon: Users, color: 'text-red-600' },
  { id: 'loss' as Category, label: 'Loss', icon: Flower, color: 'text-gray-600' },
  { id: 'growth' as Category, label: 'Growth', icon: TrendingUp, color: 'text-green-600' },
  { id: 'mental-health' as Category, label: 'Mental Health', icon: Brain, color: 'text-indigo-600' },
  { id: 'social-pressure' as Category, label: 'Social Pressure', icon: Zap, color: 'text-orange-600' },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onCategorySelect, isCollapsed }) => {
  if (isCollapsed) return null;

  return (
    <div className="w-64 bg-white dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700 transition-colors duration-200">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="h-5 w-5 text-stone-600 dark:text-stone-400" />
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
            Categories
          </h2>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              !selectedCategory
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
            }`}
          >
            All Posts
          </button>

          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? category.color : 'text-stone-500 dark:text-stone-400'}`} />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;