
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
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';

const STEP_ICONS = {
  profile: User,
  knowledge: BookOpen,
  chat: MessageSquare,
  agents: Shield,
  content: FileText
};

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { getJourneySteps, getNextStep, isJourneyComplete } = useProgressiveJourney();

  const steps = getJourneySteps();
  const nextStep = getNextStep();
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  useEffect(() => {
    if (isJourneyComplete()) {
      navigate('/dashboard');
    }
  }, [isJourneyComplete, navigate]);

  const handleStepClick = (step: any) => {
    if (!step.locked && step.route) {
      navigate(step.route);
    }
  };

  const handleSkipToNext = () => {
    if (nextStep?.route) {
      navigate(nextStep.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to LAIGENT</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Let's get you set up for the best AI-powered professional development experience
          </p>
          
          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span>Setup Progress</span>
              <span>{completedSteps}/{steps.length} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
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
                <Badge className="bg-blue-500">Next</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSkipToNext} className="w-full" size="lg">
                Continue Setup
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
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
                className={`transition-all cursor-pointer ${
                  step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : step.locked 
                    ? 'bg-gray-50 border-gray-200 opacity-60' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleStepClick(step)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-500' 
                          : step.locked 
                          ? 'bg-gray-300'
                          : 'bg-blue-500'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : step.locked ? (
                          <Lock className="h-6 w-6 text-gray-500" />
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
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      )}
                      {step.locked && (
                        <Badge variant="outline" className="text-gray-500">
                          Locked
                        </Badge>
                      )}
                      {!step.completed && !step.locked && (
                        <ArrowRight className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground"
          >
            Skip setup and go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
