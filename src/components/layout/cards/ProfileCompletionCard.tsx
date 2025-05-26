
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useProfileContext } from '@/hooks/useProfileContext';

export function ProfileCompletionCard() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const profileContext = useProfileContext();

  const completionPercentage = profile?.profile_completeness || 0;
  const isProfileIncomplete = completionPercentage < 100;
  const hasUsableProfile = completionPercentage >= 30; // Minimum for basic personalization

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Profile Setup</CardTitle>
              {hasUsableProfile && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Ready
                </Badge>
              )}
            </div>
            <CardDescription>
              {isProfileIncomplete 
                ? 'Complete your profile for personalized AI experiences'
                : 'Your profile enables personalized AI across all modules'
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Profile Completeness</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          {hasUsableProfile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm font-medium text-green-800 mb-1">
                Personalization Active
              </div>
              <div className="text-xs text-green-600">
                CLIPOGINO, Content Generator, and Knowledge Base are now personalized to your profile
              </div>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/profile')}
          >
            {isProfileIncomplete ? 'Complete Profile' : 'Manage Profile'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
