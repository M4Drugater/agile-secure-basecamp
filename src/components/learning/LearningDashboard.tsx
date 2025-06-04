
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award, 
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { useLearningPaths, LearningPath } from '@/hooks/useLearningPaths';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useAuth } from '@/contexts/AuthContext';
import { LearningPathCard } from './LearningPathCard';
import { LearningPathDetail } from './LearningPathDetail';
import { CreateLearningPathForm } from './CreateLearningPathForm';

export function LearningDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  
  const { profile } = useAuth();
  const { learningPaths, isLoading: pathsLoading } = useLearningPaths();
  const { userProgress, enrollInPath, isLoading: progressLoading } = useLearningProgress();

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  // If a path is selected, show the detail view
  if (selectedPath) {
    return (
      <LearningPathDetail 
        path={selectedPath} 
        onBack={() => setSelectedPath(null)} 
      />
    );
  }

  // Filter paths based on search and difficulty
  const filteredPaths = learningPaths?.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || path.difficulty_level === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  }) || [];

  // Get enrolled paths
  const enrolledPaths = userProgress?.map(progress => ({
    ...progress,
    path: learningPaths?.find(p => p.id === progress.learning_path_id)
  })).filter(item => item.path) || [];

  // Calculate dashboard stats
  const totalEnrolled = enrolledPaths.length;
  const totalCompleted = enrolledPaths.filter(p => p.status === 'completed').length;
  const averageProgress = enrolledPaths.length > 0 
    ? enrolledPaths.reduce((sum, p) => sum + p.progress_percentage, 0) / enrolledPaths.length 
    : 0;
  const totalTimeSpent = enrolledPaths.reduce((sum, p) => sum + p.time_spent_minutes, 0);

  const handleEnroll = (pathId: string) => {
    enrollInPath(pathId);
  };

  const handleViewPath = (path: LearningPath) => {
    setSelectedPath(path);
  };

  if (pathsLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading learning paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Learning Management</h1>
          <p className="text-muted-foreground">
            Track your learning journey and explore new paths
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Path
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Paths</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrolled}</div>
            <p className="text-xs text-muted-foreground">
              Active learning paths
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground">
              Paths completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageProgress)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all paths
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}h</div>
            <p className="text-xs text-muted-foreground">
              Total learning time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all-paths" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-paths">All Paths</TabsTrigger>
          <TabsTrigger value="my-learning">My Learning</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all-paths" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search learning paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                <Badge
                  key={level}
                  variant={selectedDifficulty === level ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedDifficulty(level)}
                >
                  {level === 'all' ? 'All Levels' : level}
                </Badge>
              ))}
            </div>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => {
              const progress = userProgress?.find(p => p.learning_path_id === path.id);
              return (
                <LearningPathCard
                  key={path.id}
                  path={path}
                  userProgress={progress}
                  onEnroll={() => handleEnroll(path.id)}
                  onContinue={() => handleViewPath(path)}
                  onView={() => handleViewPath(path)}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="my-learning" className="space-y-4">
          {enrolledPaths.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No enrolled paths yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start your learning journey by enrolling in a learning path
                </p>
                <Button onClick={() => {/* Switch to all paths tab */}}>
                  Browse Learning Paths
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledPaths
                .filter(item => item.status !== 'completed')
                .map((item) => (
                  <LearningPathCard
                    key={item.id}
                    path={item.path!}
                    userProgress={item}
                    onContinue={() => handleViewPath(item.path!)}
                    onView={() => handleViewPath(item.path!)}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {enrolledPaths.filter(item => item.status === 'completed').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No completed paths yet</h3>
                <p className="text-muted-foreground text-center">
                  Complete your first learning path to earn certificates
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledPaths
                .filter(item => item.status === 'completed')
                .map((item) => (
                  <LearningPathCard
                    key={item.id}
                    path={item.path!}
                    userProgress={item}
                    onView={() => handleViewPath(item.path!)}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Learning Path Form */}
      <CreateLearningPathForm 
        open={showCreateForm} 
        onOpenChange={setShowCreateForm} 
      />
    </div>
  );
}
