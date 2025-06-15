
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

interface SessionStatusCardProps {
  currentSession: any;
  sessionInsights: any;
}

export function SessionStatusCard({ currentSession, sessionInsights }: SessionStatusCardProps) {
  if (!currentSession) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current Session: {currentSession.session_name}
          </CardTitle>
          <Badge variant={currentSession.status === 'active' ? 'default' : 'secondary'}>
            {currentSession.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sessionInsights?.progressPercentage.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
            <Progress value={sessionInsights?.progressPercentage} className="mt-2" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sessionInsights?.activeAgents}
            </div>
            <div className="text-sm text-gray-600">Active Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sessionInsights?.collaborationInsights.totalCollaborations}
            </div>
            <div className="text-sm text-gray-600">Collaborations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {sessionInsights?.outputsGenerated}
            </div>
            <div className="text-sm text-gray-600">Outputs Generated</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
