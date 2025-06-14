import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useAutoPageCompletion } from '@/hooks/journey/useAutoPageCompletion';
import { StepCompletionCelebration } from './StepCompletionCelebration';
import { OnboardingHeader } from './onboarding/OnboardingHeader';
import { NextStepCard } from './onboarding/NextStepCard';
import { StepCard } from './onboarding/StepCard';
import { OnboardingActions } from './onboarding/OnboardingActions';

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { 
    getJourneySteps, 
    getNextStep, 
    isJourneyComplete,
    getCompletedStepsCount,
    getTotalStepsCount,
    lastCompletedStep,
    showCelebration,
    dismissCelebration,
    getEarnedAchievements,
    completeStep
  } = useProgressiveJourney();

  // Call useAutoPageCompletion here instead of inside useProgressiveJourney
  useAutoPageCompletion();

  const steps = getJourneySteps();
  const nextStep = getNextStep();
  const completedSteps = getCompletedStepsCount();
  const totalSteps = getTotalStepsCount();
  const earnedAchievements = getEarnedAchievements();

  // Only redirect if completely done AND user dismisses celebration
  useEffect(() => {
    if (isJourneyComplete() && !showCelebration) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => navigate('/dashboard'), 1000);
      return () => clearTimeout(timer);
    }
  }, [isJourneyComplete, showCelebration, navigate]);

  const handleStepClick = (step: any) => {
    if (step.route) {
      // For non-mandatory steps (chat, agents, content), auto-complete on click
      if (['chat', 'agents', 'content'].includes(step.id) && !step.completed) {
        console.log(`Auto-completing ${step.id} step on click`);
        completeStep(step.id);
      }
      navigate(step.route);
    }
  };

  const handleSkipToNext = () => {
    if (nextStep?.route) {
      // Auto-complete if it's a non-mandatory step
      if (['chat', 'agents', 'content'].includes(nextStep.id) && !nextStep.completed) {
        console.log(`Auto-completing ${nextStep.id} step on skip`);
        completeStep(nextStep.id);
      }
      navigate(nextStep.route);
    }
  };

  const handleSkipStep = (stepId: string) => {
    // Mark step as completed and move to next
    completeStep(stepId);
  };

  const handleCelebrationContinue = () => {
    dismissCelebration();
    if (nextStep?.route) {
      navigate(nextStep.route);
    } else {
      navigate('/dashboard');
    }
  };

  const handleViewProgress = () => {
    dismissCelebration();
    navigate('/dashboard');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCompleteAll = () => {
    // Auto-complete remaining steps
    steps.forEach(step => {
      if (!step.completed) {
        completeStep(step.id);
      }
    });
  };

  const completedStepData = lastCompletedStep 
    ? steps.find(s => s.id === lastCompletedStep)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <OnboardingHeader 
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          earnedAchievements={earnedAchievements}
        />

        {/* Next Step Highlight */}
        {nextStep && (
          <NextStepCard
            nextStep={nextStep}
            onContinue={handleSkipToNext}
            onSkip={() => handleSkipStep(nextStep.id)}
          />
        )}

        {/* All Steps */}
        <div className="grid gap-4">
          {steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              onStepClick={handleStepClick}
              onSkipStep={handleSkipStep}
            />
          ))}
        </div>

        {/* Quick Complete Options */}
        <OnboardingActions
          completedSteps={completedSteps}
          onGoToDashboard={handleGoToDashboard}
          onCompleteAll={handleCompleteAll}
          steps={steps}
        />
      </div>

      {/* Celebration Modal */}
      {showCelebration && completedStepData && (
        <StepCompletionCelebration
          completedStep={completedStepData}
          nextStep={nextStep}
          totalCompleted={completedSteps}
          onContinue={handleCelebrationContinue}
          onViewProgress={handleViewProgress}
        />
      )}
    </div>
  );
}
