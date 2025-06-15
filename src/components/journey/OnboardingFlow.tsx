
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useAutoPageCompletion } from '@/hooks/journey/useAutoPageCompletion';
import { StepCompletionCelebration } from './StepCompletionCelebration';
import { OnboardingContainer } from './onboarding/OnboardingContainer';
import { OnboardingLogic } from './onboarding/OnboardingLogic';

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { 
    isJourneyComplete,
    lastCompletedStep,
    showCelebration,
    dismissCelebration,
    getJourneySteps,
    getNextStep
  } = useProgressiveJourney();

  useAutoPageCompletion();

  const steps = getJourneySteps();
  const nextStep = getNextStep();

  // Only redirect if completely done AND user dismisses celebration
  useEffect(() => {
    if (isJourneyComplete() && !showCelebration) {
      const timer = setTimeout(() => navigate('/dashboard'), 1000);
      return () => clearTimeout(timer);
    }
  }, [isJourneyComplete, showCelebration, navigate]);

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

  const completedStepData = lastCompletedStep 
    ? steps.find(s => s.id === lastCompletedStep)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <OnboardingLogic>
        {(props) => (
          <OnboardingContainer {...props} />
        )}
      </OnboardingLogic>

      {showCelebration && completedStepData && (
        <StepCompletionCelebration
          completedStep={completedStepData}
          nextStep={nextStep}
          totalCompleted={steps.filter(s => s.completed).length}
          onContinue={handleCelebrationContinue}
          onViewProgress={handleViewProgress}
        />
      )}
    </div>
  );
}
