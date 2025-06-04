
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Award } from 'lucide-react';
import { LearningPathGrid } from './LearningPathGrid';
import { LearningPath } from '@/hooks/useLearningPaths';

interface LearningPathTabsProps {
  allPaths: LearningPath[];
  enrolledPaths: string[];
  completedPaths: any[];
  userProgress: any[];
  isLoading: boolean;
  searchQuery: string;
  selectedDifficulty: string;
  onEnroll: (pathId: string) => void;
  onContinue: (pathId: string) => void;
  onView: (path: LearningPath) => void;
}

export function LearningPathTabs({
  allPaths,
  enrolledPaths,
  completedPaths,
  userProgress,
  isLoading,
  searchQuery,
  selectedDifficulty,
  onEnroll,
  onContinue,
  onView
}: LearningPathTabsProps) {
  const filteredPaths = allPaths?.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || path.difficulty_level === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  }) || [];

  const enrolledFilteredPaths = filteredPaths.filter(path => enrolledPaths.includes(path.id));
  const completedFilteredPaths = filteredPaths.filter(path => 
    completedPaths.some(cp => cp.learning_path_id === path.id)
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All Paths</TabsTrigger>
        <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <LearningPathGrid
          paths={filteredPaths}
          userProgress={userProgress}
          isLoading={isLoading}
          onEnroll={onEnroll}
          onContinue={onContinue}
          onView={onView}
          emptyState={{
            icon: BookOpen,
            title: "No learning paths found",
            description: searchQuery || selectedDifficulty
              ? 'Try adjusting your search filters.'
              : 'No learning paths are available yet.'
          }}
        />
      </TabsContent>

      <TabsContent value="enrolled" className="space-y-4">
        <LearningPathGrid
          paths={enrolledFilteredPaths}
          userProgress={userProgress}
          isLoading={false}
          onEnroll={onEnroll}
          onContinue={onContinue}
          onView={onView}
          emptyState={{
            icon: BookOpen,
            title: "No enrolled paths",
            description: "Browse available learning paths and enroll to get started."
          }}
        />
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        <LearningPathGrid
          paths={completedFilteredPaths}
          userProgress={userProgress}
          isLoading={false}
          onEnroll={onEnroll}
          onContinue={onContinue}
          onView={onView}
          emptyState={{
            icon: Award,
            title: "No completed paths",
            description: "Complete your enrolled learning paths to see them here."
          }}
        />
      </TabsContent>
    </Tabs>
  );
}
