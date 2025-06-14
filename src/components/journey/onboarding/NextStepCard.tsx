
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, SkipForward } from 'lucide-react';
import { JourneyStep } from '@/hooks/useProgressiveJourney';
import { STEP_ICONS } from './stepConfig';

interface NextStepCardProps {
  nextStep: JourneyStep;
  onContinue: () => void;
  onSkip: () => void;
}

export function NextStepCard({ nextStep, onContinue, onSkip }: NextStepCardProps) {
  const Icon = STEP_ICONS[nextStep.id as keyof typeof STEP_ICONS];

  return (
    <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{nextStep.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{nextStep.description}</p>
          </div>
          <Badge className="bg-blue-500">Siguiente</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button onClick={onContinue} className="flex-1" size="lg">
            Continuar Configuración
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button onClick={onSkip} variant="outline" size="lg">
            <SkipForward className="h-4 w-4 mr-2" />
            Saltar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
