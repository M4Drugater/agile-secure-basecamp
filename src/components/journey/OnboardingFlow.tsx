
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  FileText,
  CheckCircle,
  ArrowRight,
  Sparkles,
  SkipForward
} from 'lucide-react';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { StepCompletionCelebration } from './StepCompletionCelebration';
import { AchievementBadge } from './AchievementBadge';

const STEP_ICONS = {
  profile: User,
  knowledge: BookOpen,
  chat: MessageSquare,
  agents: Shield,
  content: FileText
};

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

  const steps = getJourneySteps();
  const nextStep = getNextStep();
  const completedSteps = getCompletedStepsCount();
  const totalSteps = getTotalStepsCount();
  const progressPercentage = (completedSteps / totalSteps) * 100;
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
    // Allow navigation to any step, not just unlocked ones
    if (step.route) {
      navigate(step.route);
    }
  };

  const handleSkipToNext = () => {
    if (nextStep?.route) {
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

  const completedStepData = lastCompletedStep 
    ? steps.find(s => s.id === lastCompletedStep)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Bienvenido a LAIGENT</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Configuremos tu experiencia de desarrollo profesional con IA. Puedes completar los pasos en cualquier orden o saltarlos si lo prefieres.
          </p>
          
          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso de Configuración</span>
              <span>{completedSteps}/{totalSteps} completados</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Achievement Badges */}
          {earnedAchievements.length > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground mr-2">Conseguido:</span>
              {earnedAchievements.map((achievement) => (
                <AchievementBadge 
                  key={achievement} 
                  type={achievement} 
                  earned={true} 
                  size="sm" 
                />
              ))}
            </div>
          )}
        </div>

        {/* Next Step Highlight */}
        {nextStep && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  {React.createElement(STEP_ICONS[nextStep.id as keyof typeof STEP_ICONS], {
                    className: "h-5 w-5 text-white"
                  })}
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
                <Button onClick={handleSkipToNext} className="flex-1" size="lg">
                  Continuar Configuración
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  onClick={() => handleSkipStep(nextStep.id)} 
                  variant="outline" 
                  size="lg"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Saltar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Steps */}
        <div className="grid gap-4">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[step.id as keyof typeof STEP_ICONS];
            
            return (
              <Card 
                key={step.id}
                className={`relative transition-all duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.02] border-border ${
                  step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'border-gray-200'
                }`}
                onClick={() => handleStepClick(step)}
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
                              handleSkipStep(step.id);
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
          })}
        </div>

        {/* Quick Complete Options */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground"
            >
              Ir al Dashboard
            </Button>
            {completedSteps >= 2 && (
              <Button 
                onClick={() => {
                  // Auto-complete remaining steps
                  steps.forEach(step => {
                    if (!step.completed) {
                      completeStep(step.id);
                    }
                  });
                }}
                variant="secondary"
              >
                Completar Todo y Continuar
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            El onboarding es opcional. Puedes completar estos pasos más tarde desde el dashboard.
          </p>
        </div>
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
