
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Award, BookOpen } from 'lucide-react';
import { LearningPath } from '@/hooks/useLearningPaths';

interface LearningPathCardProps {
  path: LearningPath;
  userProgress?: {
    progress_percentage: number;
    status: string;
  };
  onEnroll?: () => void;
  onContinue?: () => void;
  onView?: () => void;
}

export function LearningPathCard({ 
  path, 
  userProgress, 
  onEnroll, 
  onContinue, 
  onView 
}: LearningPathCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isEnrolled = !!userProgress;
  const isCompleted = userProgress?.status === 'completed';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{path.title}</CardTitle>
            <CardDescription className="text-sm">
              {path.description}
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(path.difficulty_level)}>
            {path.difficulty_level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {path.estimated_duration_hours}h
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {path.enrollment_count}
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {Math.round(path.completion_rate)}%
            </div>
          </div>

          {/* Learning Objectives */}
          {path.learning_objectives && path.learning_objectives.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Learning Objectives:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {path.learning_objectives.slice(0, 3).map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {objective}
                  </li>
                ))}
                {path.learning_objectives.length > 3 && (
                  <li className="text-xs">+{path.learning_objectives.length - 3} more</li>
                )}
              </ul>
            </div>
          )}

          {/* Progress for enrolled users */}
          {isEnrolled && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(userProgress.progress_percentage)}%
                </span>
              </div>
              <Progress value={userProgress.progress_percentage} className="h-2" />
            </div>
          )}

          {/* Tags */}
          {path.tags && path.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {path.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {!isEnrolled ? (
          <>
            <Button onClick={onEnroll} className="flex-1">
              Enroll Now
            </Button>
            <Button variant="outline" onClick={onView}>
              View Details
            </Button>
          </>
        ) : isCompleted ? (
          <>
            <Button variant="outline" onClick={onView} className="flex-1">
              <Award className="h-4 w-4 mr-2" />
              View Certificate
            </Button>
            <Button variant="outline" onClick={onView}>
              Review
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onContinue} className="flex-1">
              Continue Learning
            </Button>
            <Button variant="outline" onClick={onView}>
              Details
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
