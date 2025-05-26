
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  Settings,
  List
} from 'lucide-react';
import { LearningPath } from '@/hooks/useLearningPaths';
import { useLearningModules } from '@/hooks/useLearningModules';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useAuth } from '@/contexts/AuthContext';
import { LearningExperience } from './LearningExperience';
import { ModuleBuilder } from './ModuleBuilder';

interface LearningPathDetailProps {
  path: LearningPath;
  onBack: () => void;
}

export function LearningPathDetail({ path, onBack }: LearningPathDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { profile } = useAuth();
  const { modules, isLoading: modulesLoading } = useLearningModules(path.id);
  const { userProgress, enrollInPath, isEnrolling } = useLearningProgress();
  
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const userPathProgress = userProgress?.find(p => p.learning_path_id === path.id);
  const isEnrolled = !!userPathProgress;

  const handleEnroll = () => {
    enrollInPath(path.id);
    setActiveTab('learning');
  };

  const handleStartLearning = () => {
    setActiveTab('learning');
  };

  const completedModules = modules?.filter(module => {
    return userPathProgress?.status === 'completed';
  }) || [];

  const progressPercentage = userPathProgress?.progress_percentage || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{path.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {path.estimated_duration_hours}h
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {path.enrollment_count} enrolled
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {path.average_rating.toFixed(1)}
            </div>
            <Badge variant="outline" className="capitalize">
              {path.difficulty_level}
            </Badge>
          </div>
        </div>
        
        {!isEnrolled && (
          <Button onClick={handleEnroll} disabled={isEnrolling}>
            {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        )}
        
        {isEnrolled && (
          <Button onClick={handleStartLearning}>
            <Play className="h-4 w-4 mr-2" />
            Continue Learning
          </Button>
        )}
      </div>

      {/* Progress Card for Enrolled Users */}
      {isEnrolled && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completedModules.length} of {modules?.length || 0} modules completed
                </p>
              </div>
              <Badge variant={progressPercentage === 100 ? 'default' : 'secondary'}>
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isEnrolled && <TabsTrigger value="learning">Learning</TabsTrigger>}
          {isAdmin && <TabsTrigger value="modules">Modules</TabsTrigger>}
          {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Path</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{path.description}</p>
              
              <Separator />
              
              {/* Learning Objectives */}
              {path.learning_objectives && path.learning_objectives.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Learning Objectives</h4>
                  <ul className="space-y-2">
                    {path.learning_objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {path.prerequisites && path.prerequisites.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Prerequisites</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="outline">{prereq}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {path.tags && path.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modules Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
            </CardHeader>
            <CardContent>
              {modulesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading modules...</p>
                </div>
              ) : modules && modules.length > 0 ? (
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div key={module.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {module.estimated_duration_minutes} min
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {module.module_type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No modules available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isEnrolled && (
          <TabsContent value="learning">
            <LearningExperience learningPathId={path.id} />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="modules" className="space-y-6">
            <ModuleBuilder 
              learningPathId={path.id}
              onModuleCreated={() => {
                // Refresh modules list
                window.location.reload();
              }}
            />
            
            {modules && modules.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    Existing Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {modules.map((module, index) => (
                      <div key={module.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{module.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{module.estimated_duration_minutes} min</span>
                              <span>•</span>
                              <span className="capitalize">{module.module_type}</span>
                              {module.is_required && <Badge variant="outline" className="text-xs">Required</Badge>}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Path Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Path settings and configuration options will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
