
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';
import { AchievementBadge } from '../AchievementBadge';

interface OnboardingHeaderProps {
  completedSteps: number;
  totalSteps: number;
  earnedAchievements: ('profile' | 'knowledge' | 'chat' | 'agents' | 'content')[];
}

export function OnboardingHeader({ completedSteps, totalSteps, earnedAchievements }: OnboardingHeaderProps) {
  const progressPercentage = (completedSteps / totalSteps) * 100;

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
      
      {/* Progress */}
      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-sm mb-2">
          <span>Progreso de Configuración</span>
          <span>{completedSteps}/{totalSteps} completados</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>

      {/* Achievement Badges */}
      {earnedAchievements.length > 0 && (
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
      )}
    </div>
  );
}
