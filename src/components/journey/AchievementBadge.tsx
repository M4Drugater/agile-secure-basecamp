
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Trophy, 
  Shield, 
  Crown, 
  Zap,
  Target,
  Award,
  Sparkles
} from 'lucide-react';

interface AchievementBadgeProps {
  type: 'profile' | 'knowledge' | 'chat' | 'agents' | 'content' | 'streak' | 'explorer' | 'master';
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ACHIEVEMENTS = {
  profile: {
    icon: Star,
    label: 'Profile Master',
    color: 'from-blue-500 to-purple-600',
    description: 'Completed your professional profile'
  },
  knowledge: {
    icon: Shield,
    label: 'Knowledge Builder',
    color: 'from-green-500 to-blue-600',
    description: 'Set up your knowledge base'
  },
  chat: {
    icon: Zap,
    label: 'AI Mentor',
    color: 'from-purple-500 to-pink-600',
    description: 'Connected with CLIPOGINO'
  },
  agents: {
    icon: Crown,
    label: 'Intelligence Expert',
    color: 'from-orange-500 to-red-600',
    description: 'Discovered AI agents'
  },
  content: {
    icon: Trophy,
    label: 'Content Creator',
    color: 'from-yellow-500 to-orange-600',
    description: 'Created AI-powered content'
  },
  streak: {
    icon: Target,
    label: 'Streak Master',
    color: 'from-green-500 to-teal-600',
    description: 'Maintained learning streak'
  },
  explorer: {
    icon: Award,
    label: 'Explorer',
    color: 'from-indigo-500 to-purple-600',
    description: 'Tried multiple features'
  },
  master: {
    icon: Sparkles,
    label: 'LAIGENT Master',
    color: 'from-gradient-to-r from-purple-600 via-pink-600 to-blue-600',
    description: 'Completed the full journey'
  }
};

export function AchievementBadge({ 
  type, 
  earned = false, 
  size = 'md', 
  showLabel = false 
}: AchievementBadgeProps) {
  const achievement = ACHIEVEMENTS[type];
  const Icon = achievement.icon;
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${
          earned 
            ? `bg-gradient-to-br ${achievement.color}` 
            : 'bg-gray-200'
        } transition-all duration-300 ${earned ? 'shadow-lg' : ''}`}
        title={achievement.description}
      >
        <Icon 
          className={`${iconSizes[size]} ${
            earned ? 'text-white' : 'text-gray-400'
          }`} 
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-medium ${
          earned ? 'text-gray-900' : 'text-gray-500'
        }`}>
          {achievement.label}
        </span>
      )}
    </div>
  );
}
