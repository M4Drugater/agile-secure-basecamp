
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useAuth } from '@/contexts/AuthContext';
import { useAvailableModules } from '@/hooks/journey/useAvailableModules';
import { WelcomeHeader } from './dashboard/WelcomeHeader';
import { AchievementsDisplay } from './dashboard/AchievementsDisplay';
import { ProgressTracker } from './dashboard/ProgressTracker';
import { NextStepRecommendation } from './dashboard/NextStepRecommendation';
import { ModuleGrid } from './dashboard/ModuleGrid';
import { JourneyCompletionCard } from './dashboard/JourneyCompletionCard';

export default function ProgressiveDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    getJourneySteps, 
    getNextStep, 
    isJourneyComplete, 
    userJourney,
    getCompletedStepsCount,
    getTotalStepsCount,
    getEarnedAchievements
  } = useProgressiveJourney();

  const steps = getJourneySteps();
  const nextStep = getNextStep();
  const completedSteps = getCompletedStepsCount();
  const totalSteps = getTotalStepsCount();
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const earnedAchievements = getEarnedAchievements();
  const profileCompleteness = profile?.profile_completeness || 0;

  const { getAvailableModules } = useAvailableModules(steps, profileCompleteness, isJourneyComplete());
  const availableModules = getAvailableModules();
  const newModulesCount = availableModules.filter(m => m.isNew).length;

  // Solo redirigir si realmente no hay nada configurado
  useEffect(() => {
    if (profileCompleteness < 10 && completedSteps === 0 && !profile?.full_name) {
      navigate('/onboarding');
    }
  }, [profile, completedSteps, profileCompleteness, navigate]);

  const handleModuleClick = (route: string) => {
    navigate(route);
  };

  const handleCompleteSetup = () => {
    navigate('/onboarding');
  };

  const handleContinueNext = () => {
    if (nextStep?.route) {
      navigate(nextStep.route);
    }
  };

  const handleGetStarted = () => {
    navigate(nextStep?.route || '/onboarding');
  };

  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleExploreAgents = () => {
    navigate('/competitive-intelligence');
  };

  const userName = profile?.full_name?.split(' ')[0] || 'Profesional';

  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <WelcomeHeader
          userName={userName}
          isJourneyComplete={isJourneyComplete()}
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          newModulesCount={newModulesCount}
          onCompleteSetup={handleCompleteSetup}
        />

        <AchievementsDisplay
          earnedAchievements={earnedAchievements}
          isJourneyComplete={isJourneyComplete()}
        />

        {!isJourneyComplete() && (
          <ProgressTracker
            completedSteps={completedSteps}
            totalSteps={totalSteps}
            progressPercentage={progressPercentage}
            nextStep={nextStep}
            onContinueNext={handleContinueNext}
          />
        )}

        {nextStep && (
          <NextStepRecommendation
            nextStep={nextStep}
            onGetStarted={handleGetStarted}
          />
        )}

        <ModuleGrid
          modules={availableModules}
          onModuleClick={handleModuleClick}
        />

        {isJourneyComplete() && (
          <JourneyCompletionCard
            onStartChat={handleStartChat}
            onExploreAgents={handleExploreAgents}
          />
        )}
      </div>
    </UnifiedAppLayout>
  );
}
