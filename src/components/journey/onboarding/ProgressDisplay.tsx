
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressDisplayProps {
  completedSteps: number;
  totalSteps: number;
}

export function ProgressDisplay({ completedSteps, totalSteps }: ProgressDisplayProps) {
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between text-sm mb-2">
        <span>Progreso de Configuración</span>
        <span>{completedSteps}/{totalSteps} completados</span>
      </div>
      <Progress value={progressPercentage} className="h-3" />
    </div>
  );
}
