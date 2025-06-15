
import React from 'react';
import { AchievementBadge } from '../AchievementBadge';

interface AchievementsListProps {
  earnedAchievements: ('profile' | 'knowledge' | 'chat' | 'agents' | 'content')[];
}

export function AchievementsList({ earnedAchievements }: AchievementsListProps) {
  if (earnedAchievements.length === 0) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      <span className="text-sm text-muted-foreground mr-2">Conseguido:</span>
      {earnedAchievements.map((achievement) => (
        <AchievementBadge 
          key={achievement} 
          type={achievement} 
          earned={true} 
          size="sm" 
        />
      ))}
    </div>
  );
}
