
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLearningProgress } from '@/hooks/useLearningProgress';

export function LearningManagementCard() {
  const navigate = useNavigate();
  const { userProgress } = useLearningProgress();

  const enrolledCount = userProgress?.length || 0;
  const completedCount = userProgress?.filter(p => p.status === 'completed').length || 0;
  const averageProgress = enrolledCount > 0 
    ? userProgress!.reduce((sum, p) => sum + p.progress_percentage, 0) / enrolledCount 
    : 0;

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Learning Paths</CardTitle>
          <CardDescription>
            Track your learning journey
          </CardDescription>
        </div>
        <GraduationCap className="h-8 w-8 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{enrolledCount}</div>
            <div className="text-xs text-muted-foreground">Enrolled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>

        {enrolledCount > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(averageProgress)}%
              </span>
            </div>
            <Progress value={averageProgress} className="h-2" />
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/learning')} 
            className="flex-1"
            size="sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View Paths
          </Button>
          {enrolledCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/learning?tab=my-learning')}
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
