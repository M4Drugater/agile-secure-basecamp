import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTour } from '@/contexts/TourContext';
import { ArrowRight, ArrowLeft, X, SkipForward } from 'lucide-react';
import { TourStep } from '@/contexts/TourContext';

interface TourTooltipProps {
  step: TourStep;
  targetElement: HTMLElement;
  stepNumber: number;
  totalSteps: number;
}

export function TourTooltip({ step, targetElement, stepNumber, totalSteps }: TourTooltipProps) {
  const { nextStep, prevStep, skipTour, progress } = useTour();
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    const tooltipOffset = 20;
    const tooltipWidth = 320;
    const tooltipHeight = 200; // Approximate height

    let left = rect.left;
    let top = rect.top;

    switch (step.position) {
      case 'top':
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        top = rect.top - tooltipHeight - tooltipOffset;
        break;
      case 'bottom':
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        top = rect.bottom + tooltipOffset;
        break;
      case 'left':
        left = rect.left - tooltipWidth - tooltipOffset;
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        break;
      case 'right':
        left = rect.right + tooltipOffset;
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        break;
    }

    // Keep tooltip within viewport
    const margin = 10;
    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));
    top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin));

    setTooltipStyle({
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      width: `${tooltipWidth}px`,
      zIndex: 10000
    });
  }, [targetElement, step.position]);

  return (
    <Card 
      className="shadow-2xl border-2 border-blue-200 bg-white animate-scale-in"
      style={tooltipStyle}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {stepNumber} de {totalSteps}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className="h-6 w-6 p-0 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg">{step.title}</CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {step.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {stepNumber > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Anterior
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <SkipForward className="h-3 w-3 mr-1" />
              Saltar tour
            </Button>
          </div>
          
          <Button
            onClick={nextStep}
            size="sm"
            className="text-xs bg-blue-600 hover:bg-blue-700"
          >
            {stepNumber === totalSteps ? 'Finalizar' : 'Siguiente'}
            {stepNumber < totalSteps && <ArrowRight className="h-3 w-3 ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
