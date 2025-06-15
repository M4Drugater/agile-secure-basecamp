
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  completedSteps: number;
  onGoToDashboard: () => void;
  onCompleteAll: () => void;
}

export function ActionButtons({ 
  completedSteps, 
  onGoToDashboard, 
  onCompleteAll 
}: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      <Button 
        variant="outline" 
        onClick={onGoToDashboard}
        className="text-muted-foreground"
      >
        Ir al Dashboard
      </Button>
      {completedSteps >= 2 && (
        <Button 
          onClick={onCompleteAll}
          variant="secondary"
        >
          Completar Todo y Continuar
        </Button>
      )}
    </div>
  );
}
