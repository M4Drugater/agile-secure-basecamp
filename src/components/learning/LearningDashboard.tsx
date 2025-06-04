
import React, { useState } from 'react';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { LearningPathDetail } from './LearningPathDetail';
import { LearningPathStats } from './LearningPathStats';
import { LearningDashboardHeader } from './dashboard/LearningDashboardHeader';
import { LearningDashboardContent } from './dashboard/LearningDashboardContent';
import { AIRecommendationsPanel } from './ai-enhancements';

export function LearningDashboard() {
  const { learningPaths, isLoading } = useLearningPaths();
  const { userProgress } = useLearningProgress();
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [showGenerator, setShowGenerator] = useState(false);

  const filteredPaths = learningPaths?.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || path.difficulty_level === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  }) || [];

  const enrolledPaths = userProgress?.map(p => p.learning_path_id) || [];
  const completedPaths = userProgress?.filter(p => p.status === 'completed') || [];

  const handlePathGenerated = (pathData: any) => {
    console.log('Generated path:', pathData);
    setShowGenerator(false);
  };

  const handleEnroll = (pathId: string) => {
    console.log('Enroll in', pathId);
  };

  const handleContinue = (pathId: string) => {
    console.log('Continue', pathId);
  };

  const handleRecommendationSelect = (recommendation: any) => {
    console.log('Selected recommendation:', recommendation);
  };

  if (selectedPath) {
    return (
      <LearningPathDetail 
        path={selectedPath} 
        onBack={() => setSelectedPath(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <LearningDashboardHeader
        showGenerator={showGenerator}
        onToggleGenerator={() => setShowGenerator(!showGenerator)}
      />

      {/* Stats Overview */}
      <LearningPathStats learningPaths={learningPaths || []} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <LearningDashboardContent
          showGenerator={showGenerator}
          onPathGenerated={handlePathGenerated}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredPaths={filteredPaths}
          enrolledPaths={enrolledPaths}
          completedPaths={completedPaths}
          userProgress={userProgress || []}
          isLoading={isLoading}
          selectedDifficulty={selectedDifficulty}
          onEnroll={handleEnroll}
          onContinue={handleContinue}
          onView={setSelectedPath}
        />

        {/* AI Recommendations Sidebar */}
        <div className="lg:col-span-1">
          <AIRecommendationsPanel 
            onRecommendationSelect={handleRecommendationSelect}
          />
        </div>
      </div>
    </div>
  );
}
