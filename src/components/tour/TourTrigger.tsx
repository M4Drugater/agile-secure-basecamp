
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTour } from '@/contexts/TourContext';
import { Play, RotateCcw } from 'lucide-react';

interface TourTriggerProps {
  variant?: 'default' | 'badge' | 'minimal';
  className?: string;
}

export function TourTrigger({ variant = 'default', className = '' }: TourTriggerProps) {
  const { startTour, isCompleted } = useTour();

  if (variant === 'badge') {
    return (
      <Badge 
        variant="secondary" 
        className={`cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors ${className}`}
        onClick={startTour}
      >
        <Play className="h-3 w-3 mr-1" />
        {isCompleted ? 'Ver tour de nuevo' : 'Comenzar tour'}
      </Badge>
    );
  }

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={startTour}
        className={`text-xs text-muted-foreground hover:text-blue-600 ${className}`}
      >
        {isCompleted ? (
          <>
            <RotateCcw className="h-3 w-3 mr-1" />
            Repetir tour
          </>
        ) : (
          <>
            <Play className="h-3 w-3 mr-1" />
            Iniciar tour
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={startTour}
      className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ${className}`}
    >
      <Play className="h-4 w-4 mr-2" />
      {isCompleted ? 'Repetir Tour Interactivo' : 'Comenzar Tour Interactivo'}
    </Button>
  );
}
