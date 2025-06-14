
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { AchievementBadge } from '../AchievementBadge';

interface AchievementsDisplayProps {
  earnedAchievements: ('profile' | 'knowledge' | 'chat' | 'agents' | 'content')[];
  isJourneyComplete: boolean;
}

export function AchievementsDisplay({ earnedAchievements, isJourneyComplete }: AchievementsDisplayProps) {
  if (earnedAchievements.length === 0) return null;

  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">Your Achievements</span>
          </div>
          <div className="flex gap-2">
            {earnedAchievements.map((achievement) => (
              <AchievementBadge 
                key={achievement} 
                type={achievement} 
                earned={true} 
                size="sm"
                showLabel={false} 
              />
            ))}
            {isJourneyComplete && (
              <AchievementBadge 
                type="master" 
                earned={true} 
                size="sm"
                showLabel={false} 
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
