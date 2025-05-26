
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProfileCompletionHeaderProps {
  completionPercentage: number;
}

export function ProfileCompletionHeader({ completionPercentage }: ProfileCompletionHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
        <CardDescription>
          Complete your profile to get personalized AI mentoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Profile Completeness</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
