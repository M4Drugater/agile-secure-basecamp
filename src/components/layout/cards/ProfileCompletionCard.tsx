
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';

export function ProfileCompletionCard() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  const completionPercentage = profile?.profile_completeness || 0;
  const isProfileIncomplete = completionPercentage < 100;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Profile Setup</CardTitle>
            <CardDescription>
              {isProfileIncomplete 
                ? 'Complete your profile for personalized mentoring'
                : 'Your profile is complete!'
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
          
          {isProfileIncomplete ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/profile')}
            >
              Complete Profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/profile')}
            >
              View Profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
