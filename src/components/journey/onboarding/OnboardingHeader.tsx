
import React from 'react';
import { Sparkles } from 'lucide-react';
import { ProgressDisplay } from './ProgressDisplay';
import { AchievementsList } from './AchievementsList';

interface OnboardingHeaderProps {
  completedSteps: number;
  totalSteps: number;
  earnedAchievements: ('profile' | 'knowledge' | 'chat' | 'agents' | 'content')[];
}

export function OnboardingHeader({ completedSteps, totalSteps, earnedAchievements }: OnboardingHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Bienvenido a LAIGENT</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-6">
        Configuremos tu experiencia de desarrollo profesional con IA. Puedes completar los pasos en cualquier orden o saltarlos si lo prefieres.
      </p>
      
      <ProgressDisplay 
        completedSteps={completedSteps}
        totalSteps={totalSteps}
      />

      <AchievementsList earnedAchievements={earnedAchievements} />
    </div>
  );
}
