
import React from 'react';
import { StepCard } from './StepCard';
import { JourneyStep } from '@/hooks/useProgressiveJourney';

interface StepsListProps {
  steps: JourneyStep[];
  onStepClick: (step: JourneyStep) => void;
  onSkipStep: (stepId: string) => void;
}

export function StepsList({ steps, onStepClick, onSkipStep }: StepsListProps) {
  return (
    <div className="grid gap-4">
      {steps.map((step, index) => (
        <StepCard
          key={step.id}
          step={step}
          index={index}
          onStepClick={onStepClick}
          onSkipStep={onSkipStep}
        />
      ))}
    </div>
  );
}
