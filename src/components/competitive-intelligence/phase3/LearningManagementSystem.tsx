
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Clock,
  PlayCircle,
  CheckCircle,
  Star,
  Target,
  Users,
  Brain
} from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'strategy' | 'analysis' | 'intelligence' | 'leadership';
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  rating: number;
  enrolledUsers: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: string[];
  totalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completionRate: number;
  enrolledUsers: number;
  badge: string;
}

export function LearningManagementSystem() {
  const [learningModules] = useState<LearningModule[]>([
    {
      id: '1',
      title: 'Advanced Competitive Intelligence Fundamentals',
      description: 'Master the core principles of competitive intelligence gathering and analysis',
      duration: '2h 30m',
      difficulty: 'intermediate',
      category: 'intelligence',
      progress: 75,
      status: 'in_progress',
      rating: 4.8,
      enrolledUsers: 342
    },
    {
      id: '2',
      title: 'McKinsey Strategic Framework Mastery',
      description: 'Learn and apply McKinsey\'s proven strategic analysis frameworks',
      duration: '3h 15m',
      difficulty: 'advanced',
      category: 'strategy',
      progress: 100,
      status: 'completed',
      rating: 4.9,
      enrolledUsers: 287
    },
    {
      id: '3',
      title: 'Real-Time Market Analysis Techniques',
      description: 'Advanced techniques for real-time market intelligence and competitive monitoring',
      duration: '1h 45m',
      difficulty: 'intermediate',
      category: 'analysis',
      progress: 0,
      status: 'not_started',
      rating: 4.7,
      enrolledUsers: 198
    },
    {
      id: '4',
      title: 'Executive Decision Making for CI Leaders',
      description: 'Leadership skills for competitive intelligence and strategic decision making',
      duration: '2h 0m',
      difficulty: 'advanced',
      category: 'leadership',
      progress: 45,
      status: 'in_progress',
      rating: 4.6,
      enrolledUsers: 156
    }
  ]);

  const [learningPaths] = useState<LearningPath[]>([
    {
      id: '1',
      title: 'Competitive Intelligence Professional',
      description: 'Complete certification path for CI professionals',
      modules: ['1', '2', '3'],
      totalDuration: '7h 30m',
      difficulty: 'intermediate',
      completionRate: 68,
      enrolledUsers: 234,
      badge: 'CI Professional'
    },
    {
      id: '2',
      title: 'Strategic Leadership Excellence',
      description: 'Executive-level strategic thinking and leadership development',
      modules: ['2', '4'],
      totalDuration: '5h 15m',
      difficulty: 'advanced',
      completionRate: 45,
      enrolledUsers: 145,
      badge: 'Strategic Leader'
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strategy': return 'bg-blue-500';
      case 'analysis': return 'bg-purple-500';
      case 'intelligence': return 'bg-orange-500';
      case 'leadership': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <PlayCircle className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const totalProgress = learningModules.reduce((sum, module) => sum + module.progress, 0) / learningModules.length;
  const completedModules = learningModules.filter(m => m.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-500" />
            Learning Management System
          </h2>
          <p className="text-muted-foreground">
            Comprehensive AI-enhanced learning and certification platform
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI-Enhanced Learning
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            {completedModules} Completed
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {learningModules.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Modules</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {completedModules}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {totalProgress.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Progress</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {learningPaths.length}
            </div>
            <div className="text-sm text-muted-foreground">Learning Paths</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {learningModules.map((module) => (
              <Card key={module.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      <Badge 
                        variant="secondary"
                        className={`${getCategoryColor(module.category)} text-white text-xs`}
                      >
                        {module.category}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={`${getDifficultyColor(module.difficulty)} text-white text-xs`}
                      >
                        {module.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>

                  {/* Module Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{module.enrolledUsers} enrolled</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(module.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {module.rating} ({module.enrolledUsers} reviews)
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(module.status)}
                      <span className="text-sm capitalize">{module.status.replace('_', ' ')}</span>
                    </div>
                    <Button 
                      size="sm"
                      variant={module.status === 'not_started' ? 'default' : 'outline'}
                    >
                      {module.status === 'not_started' ? 'Start Learning' : 
                       module.status === 'in_progress' ? 'Continue' : 'Review'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths">
          <div className="space-y-6">
            {learningPaths.map((path) => (
              <Card key={path.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">
                        {path.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary"
                        className={`${getDifficultyColor(path.difficulty)} text-white`}
                      >
                        {path.difficulty}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {path.badge}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Path Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Path Completion</span>
                      <span className="text-sm">{path.completionRate}%</span>
                    </div>
                    <Progress value={path.completionRate} className="h-3" />
                  </div>

                  {/* Path Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{path.modules.length}</div>
                      <div className="text-sm text-muted-foreground">Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{path.totalDuration}</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{path.enrolledUsers}</div>
                      <div className="text-sm text-muted-foreground">Enrolled</div>
                    </div>
                  </div>

                  <Button className="w-full">
                    Continue Learning Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
