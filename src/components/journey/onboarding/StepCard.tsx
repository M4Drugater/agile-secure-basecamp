
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, SkipForward } from 'lucide-react';
import { JourneyStep } from '@/hooks/useProgressiveJourney';
import { AchievementBadge } from '../AchievementBadge';
import { STEP_ICONS } from './stepConfig';

interface StepCardProps {
  step: JourneyStep;
  index: number;
  onStepClick: (step: JourneyStep) => void;
  onSkipStep: (stepId: string) => void;
}

export function StepCard({ step, index, onStepClick, onSkipStep }: StepCardProps) {
  const Icon = STEP_ICONS[step.id as keyof typeof STEP_ICONS];

  return (
    <Card 
      className={`relative transition-all duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.02] border-border ${
        step.completed 
          ? 'bg-green-50 border-green-200' 
          : 'border-gray-200'
      }`}
      onClick={() => onStepClick(step)}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              step.completed 
                ? 'bg-green-500' 
                : 'bg-blue-500'
            }`}>
              {step.completed ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : (
                <Icon className="h-6 w-6 text-white" />
              )}
            </div>
            <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step.completed 
                ? 'bg-green-600 text-white' 
                : 'bg-white border-2 border-gray-300 text-gray-600'
            }`}>
              {index + 1}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>

          <div className="flex items-center gap-2">
            {step.completed && (
              <>
                <AchievementBadge 
                  type={step.id as 'profile' | 'knowledge' | 'chat' | 'agents' | 'content'} 
                  earned={true} 
                  size="sm" 
                />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Completado
                </Badge>
              </>
            )}
            {!step.completed && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSkipStep(step.id);
                  }}
                  className="text-xs"
                >
                  <SkipForward className="h-3 w-3 mr-1" />
                  Saltar
                </Button>
                <ArrowRight className="h-5 w-5 text-blue-500" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
