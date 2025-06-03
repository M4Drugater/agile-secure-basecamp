
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award,
  Plus,
  Search,
  Filter,
  Sparkles,
  Brain
} from 'lucide-react';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { LearningPathCard } from './LearningPathCard';
import { LearningPathDetail } from './LearningPathDetail';
import { LearningPathSearch } from './LearningPathSearch';
import { LearningPathStats } from './LearningPathStats';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AIRecommendationsPanel, SmartLearningPathGenerator } from './ai-enhancements';

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
            onClick={() => setShowGenerator(!showGenerator)}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            AI Path Generator
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <LearningPathStats />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Generator */}
          {showGenerator && (
            <SmartLearningPathGenerator 
              onPathGenerated={(pathData) => {
                console.log('Generated path:', pathData);
                setShowGenerator(false);
              }}
            />
          )}

          {/* Search and Filters */}
          <LearningPathSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
          />

          {/* Learning Paths */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Paths</TabsTrigger>
              <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner text="Loading learning paths..." />
                </div>
              ) : filteredPaths.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPaths.map((path) => (
                    <LearningPathCard
                      key={path.id}
                      path={path}
                      isEnrolled={enrolledPaths.includes(path.id)}
                      onSelect={() => setSelectedPath(path)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No learning paths found</h3>
                    <p className="text-muted-foreground text-center">
                      {searchQuery || selectedDifficulty
                        ? 'Try adjusting your search filters.'
                        : 'No learning paths are available yet.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="enrolled" className="space-y-4">
              {enrolledPaths.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPaths
                    .filter(path => enrolledPaths.includes(path.id))
                    .map((path) => (
                      <LearningPathCard
                        key={path.id}
                        path={path}
                        isEnrolled={true}
                        onSelect={() => setSelectedPath(path)}
                      />
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No enrolled paths</h3>
                    <p className="text-muted-foreground text-center">
                      Browse available learning paths and enroll to get started.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedPaths.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPaths
                    .filter(path => completedPaths.some(cp => cp.learning_path_id === path.id))
                    .map((path) => (
                      <LearningPathCard
                        key={path.id}
                        path={path}
                        isEnrolled={true}
                        isCompleted={true}
                        onSelect={() => setSelectedPath(path)}
                      />
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Award className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No completed paths</h3>
                    <p className="text-muted-foreground text-center">
                      Complete your enrolled learning paths to see them here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Recommendations Sidebar */}
        <div className="lg:col-span-1">
          <AIRecommendationsPanel 
            onRecommendationSelect={(recommendation) => {
              console.log('Selected recommendation:', recommendation);
              // Handle recommendation selection
            }}
          />
        </div>
      </div>
    </div>
  );
}
