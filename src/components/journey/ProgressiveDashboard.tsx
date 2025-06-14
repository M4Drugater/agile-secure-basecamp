
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  FileText,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useAuth } from '@/contexts/AuthContext';

export default function ProgressiveDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    getJourneySteps, 
    getNextStep, 
    isJourneyComplete, 
    userJourney 
  } = useProgressiveJourney();

  const steps = getJourneySteps();
  const nextStep = getNextStep();
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  // Redirect to onboarding if profile completion is too low
  useEffect(() => {
    const profileCompleteness = profile?.profile_completeness || 0;
    if (profileCompleteness < 30 && !userJourney?.profile_completed) {
      navigate('/onboarding');
    }
  }, [profile, userJourney, navigate]);

  const getAvailableModules = () => {
    const modules = [];
    
    // Always available
    modules.push({
      id: 'profile',
      title: 'Your Profile',
      description: 'Manage your professional information',
      icon: User,
      route: '/profile',
      available: true,
      completion: profile?.profile_completeness || 0
    });

    // Available after profile setup
    if (steps.find(s => s.id === 'profile')?.completed) {
      modules.push({
        id: 'knowledge',
        title: 'Knowledge Base',
        description: 'Upload and manage your documents',
        icon: BookOpen,
        route: '/knowledge',
        available: true
      });

      modules.push({
        id: 'chat',
        title: 'CLIPOGINO AI Mentor',
        description: 'Chat with your personalized AI assistant',
        icon: MessageSquare,
        route: '/chat',
        available: true,
        badge: 'AI Powered'
      });
    }

    // Available after first chat
    if (steps.find(s => s.id === 'chat')?.completed) {
      modules.push({
        id: 'competitive',
        title: 'Competitive Intelligence',
        description: 'CDV, CIA, and CIR agents for market analysis',
        icon: Shield,
        route: '/competitive-intelligence',
        available: true,
        badge: 'AI Agents'
      });

      modules.push({
        id: 'content',
        title: 'Content Creation',
        description: 'Generate professional content with AI',
        icon: FileText,
        route: '/content-generator',
        available: true
      });
    }

    // Advanced features (available after completing main journey)
    if (isJourneyComplete()) {
      modules.push({
        id: 'trends',
        title: 'Trends Discovery',
        description: 'Real-time Reddit trends analysis',
        icon: TrendingUp,
        route: '/trends',
        available: true,
        badge: 'Live Data'
      });
    }

    return modules;
  };

  const availableModules = getAvailableModules();

  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'Professional'}! 👋
              </h1>
              <p className="text-muted-foreground">
                {isJourneyComplete() 
                  ? 'Your AI-powered workspace is ready for professional growth'
                  : 'Continue your setup to unlock the full potential of LAIGENT'
                }
              </p>
            </div>
            {!isJourneyComplete() && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/onboarding')}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Complete Setup
              </Button>
            )}
          </div>

          {/* Progress Bar (only show if not complete) */}
          {!isJourneyComplete() && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Setup Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      {completedSteps} of {steps.length} steps completed
                    </p>
                  </div>
                  <Badge className="bg-blue-500">
                    {Math.round(progressPercentage)}% Complete
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="mb-3" />
                {nextStep && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next: {nextStep.title}</span>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(nextStep.route || '/onboarding')}
                      className="flex items-center gap-1"
                    >
                      Continue
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions for Next Step */}
        {nextStep && (
          <Card className="mb-8 border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Sparkles className="h-5 w-5" />
                Recommended Next Step
              </CardTitle>
              <CardDescription>
                Complete this step to unlock more AI-powered features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{nextStep.title}</h4>
                  <p className="text-sm text-muted-foreground">{nextStep.description}</p>
                </div>
                <Button onClick={() => navigate(nextStep.route || '/onboarding')}>
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableModules.map((module) => {
            const Icon = module.icon;
            
            return (
              <Card 
                key={module.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  module.available ? 'hover:scale-105' : 'opacity-60'
                }`}
                onClick={() => module.available && navigate(module.route)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {module.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {module.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {module.completion !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span>{module.completion}%</span>
                      </div>
                      <Progress value={module.completion} className="h-2" />
                    </div>
                  )}
                  {module.available && (
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Available
                      </span>
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Journey Complete Celebration */}
        {isJourneyComplete() && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Setup Complete! 🎉</h3>
              <p className="text-muted-foreground mb-4">
                You've unlocked the full power of LAIGENT. Your AI-powered professional development journey begins now!
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={() => navigate('/chat')}>
                  Start with CLIPOGINO
                  <MessageSquare className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/competitive-intelligence')}>
                  Explore AI Agents
                  <Shield className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </UnifiedAppLayout>
  );
}
