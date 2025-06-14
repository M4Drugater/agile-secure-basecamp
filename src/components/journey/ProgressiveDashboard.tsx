
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useAuth } from '@/contexts/AuthContext';
import { useAvailableModules } from '@/hooks/journey/useAvailableModules';
import { useProgressNotifications } from '@/hooks/journey/useProgressNotifications';
import { WelcomeHeader } from './dashboard/WelcomeHeader';
import { AchievementsDisplay } from './dashboard/AchievementsDisplay';
import { ProgressTracker } from './dashboard/ProgressTracker';
import { NextStepRecommendation } from './dashboard/NextStepRecommendation';
import { ModuleGrid } from './dashboard/ModuleGrid';
import { JourneyCompletionCard } from './dashboard/JourneyCompletionCard';
import { ProgressNotifications } from './ProgressNotifications';
import { TourProvider } from '@/contexts/TourContext';
import { TourOverlay } from '@/components/tour/TourOverlay';
import { TourTrigger } from '@/components/tour/TourTrigger';
import { DASHBOARD_TOUR_STEPS } from '@/components/tour/tourSteps';

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
    getEarnedAchievements,
    isInitialized,
    isLoading
  } = useProgressiveJourney();

  const { 
    notifications, 
    addNotification, 
    removeNotification 
  } = useProgressNotifications();

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

  // All useEffect hooks must be called before any conditional logic
  useEffect(() => {
    const unlockedModules = availableModules.filter(m => m.isNew && m.available);
    
    unlockedModules.forEach(module => {
      if (module.id !== 'profile') { // Don't show notification for profile
        addNotification({
          type: 'module_unlocked',
          title: `${module.title} Desbloqueado`,
          message: `Ahora puedes acceder a: ${module.description}`
        });
      }
    });
  }, [availableModules, addNotification]);

  useEffect(() => {
    if (profileCompleteness < 10 && completedSteps === 0 && !profile?.full_name) {
      navigate('/onboarding');
    }
  }, [profile, completedSteps, profileCompleteness, navigate]);

  // Show loading while journey is being initialized
  if (isLoading || !isInitialized) {
    return (
      <UnifiedAppLayout>
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Inicializando tu progreso...</p>
            </div>
          </div>
        </div>
      </UnifiedAppLayout>
    );
  }

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
    <TourProvider steps={DASHBOARD_TOUR_STEPS}>
      <UnifiedAppLayout>
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <div data-tour="welcome-header">
            <WelcomeHeader
              userName={userName}
              isJourneyComplete={isJourneyComplete()}
              completedSteps={completedSteps}
              totalSteps={totalSteps}
              newModulesCount={newModulesCount}
              onCompleteSetup={handleCompleteSetup}
            />
          </div>

          {/* Tour trigger section */}
          <div className="mb-6 text-center">
            <TourTrigger />
          </div>

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

        {/* Progress Notifications */}
        <ProgressNotifications
          notifications={notifications}
          onRemove={removeNotification}
        />

        {/* Tour Overlay */}
        <TourOverlay />
      </UnifiedAppLayout>
    </TourProvider>
  );
}
