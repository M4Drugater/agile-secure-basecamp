
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Award } from 'lucide-react';
import { LearningPathCard } from '../LearningPathCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LearningPath } from '@/hooks/useLearningPaths';

interface LearningPathGridProps {
  paths: LearningPath[];
  userProgress: any[];
  isLoading: boolean;
  onEnroll: (pathId: string) => void;
  onContinue: (pathId: string) => void;
  onView: (path: LearningPath) => void;
  emptyState: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  };
}

export function LearningPathGrid({
  paths,
  userProgress,
  isLoading,
  onEnroll,
  onContinue,
  onView,
  emptyState
}: LearningPathGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner text="Loading learning paths..." />
      </div>
    );
  }

  if (paths.length === 0) {
    const IconComponent = emptyState.icon;
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <IconComponent className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{emptyState.title}</h3>
          <p className="text-muted-foreground text-center">
            {emptyState.description}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {paths.map((path) => {
        const userPathProgress = userProgress?.find(p => p.learning_path_id === path.id);
        return (
          <LearningPathCard
            key={path.id}
            path={path}
            userProgress={userPathProgress}
            onEnroll={() => onEnroll(path.id)}
            onContinue={() => onContinue(path.id)}
            onView={() => onView(path)}
          />
        );
      })}
    </div>
  );
}
