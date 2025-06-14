
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Star, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  Gift
} from 'lucide-react';
import { JourneyStep } from '@/hooks/useProgressiveJourney';

interface StepCompletionCelebrationProps {
  completedStep: JourneyStep;
  nextStep: JourneyStep | null;
  totalCompleted: number;
  onContinue: () => void;
  onViewProgress: () => void;
}

const STEP_REWARDS = {
  profile: {
    title: "Profile Master!",
    description: "You've unlocked personalized AI mentoring",
    badge: "Profile Complete",
    reward: "CLIPOGINO can now provide personalized guidance"
  },
  knowledge: {
    title: "Knowledge Builder!",
    description: "Your AI mentor now knows your expertise",
    badge: "Knowledge Ready",
    reward: "Enhanced AI responses based on your documents"
  },
  chat: {
    title: "AI Mentor Connected!",
    description: "You've started your journey with CLIPOGINO",
    badge: "Chat Master",
    reward: "Unlocked competitive intelligence agents"
  },
  agents: {
    title: "Intelligence Expert!",
    description: "You've discovered the power of AI agents",
    badge: "Agent Explorer",
    reward: "Advanced content creation capabilities"
  },
  content: {
    title: "Content Creator!",
    description: "You've mastered AI-powered content generation",
    badge: "Creator Pro",
    reward: "Full platform access unlocked"
  }
};

export function StepCompletionCelebration({ 
  completedStep, 
  nextStep, 
  totalCompleted,
  onContinue, 
  onViewProgress 
}: StepCompletionCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const reward = STEP_REWARDS[completedStep.id as keyof typeof STEP_REWARDS];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`max-w-md w-full transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <CardContent className="p-8 text-center space-y-6">
          {/* Celebration Animation */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-yellow-500 animate-spin" />
            </div>
          </div>

          {/* Achievement Title */}
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              {reward?.title || 'Step Complete!'}
            </h2>
            <p className="text-muted-foreground">
              {reward?.description || completedStep.description}
            </p>
          </div>

          {/* Badge Earned */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold">Badge Earned</span>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              {reward?.badge || 'Achievement Unlocked'}
            </Badge>
          </div>

          {/* Reward Info */}
          {reward?.reward && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Reward Unlocked</span>
              </div>
              <p className="text-sm text-green-700">{reward.reward}</p>
            </div>
          )}

          {/* Progress */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {totalCompleted}/5 Steps Complete
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {nextStep ? (
              <Button onClick={onContinue} className="w-full" size="lg">
                Continue to {nextStep.title}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={onViewProgress} className="w-full" size="lg">
                View Your Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            <Button variant="outline" onClick={onViewProgress} className="w-full">
              View All Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
