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

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const tooltipOffset = 20;
      const tooltipWidth = 360;
      const tooltipHeight = 280;

      let left = rect.left;
      let top = rect.top;
      let arrowPosition = '';

      switch (step.position) {
        case 'top':
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          top = rect.top - tooltipHeight - tooltipOffset;
          arrowPosition = 'bottom';
          break;
        case 'bottom':
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          top = rect.bottom + tooltipOffset;
          arrowPosition = 'top';
          break;
        case 'left':
          left = rect.left - tooltipWidth - tooltipOffset;
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          arrowPosition = 'right';
          break;
        case 'right':
          left = rect.right + tooltipOffset;
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          arrowPosition = 'left';
          break;
      }

      // Keep tooltip within viewport with better margins
      const margin = 20;
      const maxLeft = window.innerWidth - tooltipWidth - margin;
      const maxTop = window.innerHeight - tooltipHeight - margin;
      
      left = Math.max(margin, Math.min(left, maxLeft));
      top = Math.max(margin, Math.min(top, maxTop));

      setTooltipStyle({
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${tooltipWidth}px`,
        zIndex: 10000,
        maxHeight: `${tooltipHeight}px`
      });
    };

    updatePosition();
    
    // Update position on scroll and resize
    const handleUpdate = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [targetElement, step.position]);

  return (
    <Card 
      className="shadow-2xl border-2 border-blue-200 bg-white animate-in fade-in-50 slide-in-from-bottom-5 duration-300"
      style={tooltipStyle}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
            {stepNumber} de {totalSteps}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg text-gray-800">{step.title}</CardTitle>
        <Progress value={progress} className="h-2 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </Progress>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
          {step.content}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            {stepNumber > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                className="text-xs hover:bg-gray-50"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Anterior
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              <SkipForward className="h-3 w-3 mr-1" />
              Saltar
            </Button>
          </div>
          
          <Button
            onClick={nextStep}
            size="sm"
            className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {stepNumber === totalSteps ? 'Finalizar' : 'Siguiente'}
            {stepNumber < totalSteps && <ArrowRight className="h-3 w-3 ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
