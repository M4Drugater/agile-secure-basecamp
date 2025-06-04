
import React from 'react';
import { LearningPathSearch } from '../LearningPathSearch';
import { LearningPathTabs } from './LearningPathTabs';
import { SmartLearningPathGenerator } from '../ai-enhancements';
import { LearningPath } from '@/hooks/useLearningPaths';

interface LearningDashboardContentProps {
  showGenerator: boolean;
  onPathGenerated: (pathData: any) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredPaths: LearningPath[];
  enrolledPaths: string[];
  completedPaths: any[];
  userProgress: any[];
  isLoading: boolean;
  selectedDifficulty: string;
  onEnroll: (pathId: string) => void;
  onContinue: (pathId: string) => void;
  onView: (path: LearningPath) => void;
}

export function LearningDashboardContent({
  showGenerator,
  onPathGenerated,
  searchQuery,
  onSearchChange,
  filteredPaths,
  enrolledPaths,
  completedPaths,
  userProgress,
  isLoading,
  selectedDifficulty,
  onEnroll,
  onContinue,
  onView
}: LearningDashboardContentProps) {
  return (
    <div className="lg:col-span-3 space-y-6">
      {/* AI Generator */}
      {showGenerator && (
        <SmartLearningPathGenerator 
          onPathGenerated={onPathGenerated}
        />
      )}

      {/* Search and Filters */}
      <LearningPathSearch
        searchTerm={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* Learning Paths */}
      <LearningPathTabs
        allPaths={filteredPaths}
        enrolledPaths={enrolledPaths}
        completedPaths={completedPaths}
        userProgress={userProgress}
        isLoading={isLoading}
        searchQuery={searchQuery}
        selectedDifficulty={selectedDifficulty}
        onEnroll={onEnroll}
        onContinue={onContinue}
        onView={onView}
      />
    </div>
  );
}
