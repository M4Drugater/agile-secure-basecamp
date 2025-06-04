
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

interface LearningDashboardHeaderProps {
  showGenerator: boolean;
  onToggleGenerator: () => void;
}

export function LearningDashboardHeader({ 
  showGenerator, 
  onToggleGenerator 
}: LearningDashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Learning Dashboard</h1>
        <p className="text-muted-foreground">
          Discover, enroll in, and track your learning journey
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onToggleGenerator}
          className="flex items-center gap-2"
        >
          <Brain className="h-4 w-4" />
          AI Path Generator
        </Button>
      </div>
    </div>
  );
}
