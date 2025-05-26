
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Clock, 
  CheckCircle2,
  Play,
  FileText,
  Video,
  HelpCircle,
  CheckSquare,
  MessageSquare
} from 'lucide-react';
import { useLearningModules } from '@/hooks/useLearningModules';
import { useLearningProgress } from '@/hooks/useLearningProgress';

interface LearningExperienceProps {
  learningPathId: string;
  onComplete?: () => void;
}

const moduleTypeIcons = {
  text: FileText,
  video: Video,
  interactive: BookOpen,
  quiz: HelpCircle,
  assignment: CheckSquare,
  discussion: MessageSquare,
};

export function LearningExperience({ learningPathId, onComplete }: LearningExperienceProps) {
  const { modules, isLoading: modulesLoading } = useLearningModules(learningPathId);
  const { userProgress, updateModuleProgress } = useLearningProgress();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isModuleComplete, setIsModuleComplete] = useState(false);

  const currentModule = modules?.[currentModuleIndex];
  const moduleProgress = userProgress?.find(p => p.learning_path_id === learningPathId);
  
  const completedModules = modules?.filter(module => {
    const progress = userProgress?.find(p => p.learning_path_id === learningPathId);
    return progress?.current_module_id === module.id && progress?.status === 'completed';
  }) || [];

  const overallProgress = modules?.length ? (completedModules.length / modules.length) * 100 : 0;

  useEffect(() => {
    if (currentModule && moduleProgress) {
      // Mark module as in progress
      updateModuleProgress({
        learning_path_id: learningPathId,
        module_id: currentModule.id,
        status: 'in_progress',
        progress_percentage: 0,
      });
    }
  }, [currentModule, learningPathId]);

  const handleNext = () => {
    if (currentModuleIndex < (modules?.length || 0) - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setIsModuleComplete(false);
    }
  };

  const handlePrevious = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setIsModuleComplete(false);
    }
  };

  const handleCompleteModule = () => {
    if (currentModule) {
      updateModuleProgress({
        learning_path_id: learningPathId,
        module_id: currentModule.id,
        status: 'completed',
        progress_percentage: 100,
      });
      setIsModuleComplete(true);
      
      // If this is the last module, complete the entire path
      if (currentModuleIndex === (modules?.length || 0) - 1) {
        onComplete?.();
      }
    }
  };

  const jumpToModule = (index: number) => {
    setCurrentModuleIndex(index);
    setIsModuleComplete(false);
  };

  if (modulesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading learning experience...</p>
        </div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No modules available</h3>
          <p className="text-muted-foreground text-center">
            This learning path doesn't have any modules yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const ModuleIcon = moduleTypeIcons[currentModule?.module_type || 'text'];

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Learning Progress</CardTitle>
              <p className="text-sm text-muted-foreground">
                Module {currentModuleIndex + 1} of {modules.length}
              </p>
            </div>
            <Badge variant="outline" className="ml-auto">
              {Math.round(overallProgress)}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedModules.length} completed</span>
            <span>{modules.length - completedModules.length} remaining</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Navigation Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {modules.map((module, index) => {
              const Icon = moduleTypeIcons[module.module_type];
              const isCompleted = completedModules.some(m => m.id === module.id);
              const isCurrent = index === currentModuleIndex;
              
              return (
                <Button
                  key={module.id}
                  variant={isCurrent ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-3 ${
                    isCompleted ? 'bg-green-50 hover:bg-green-100' : ''
                  }`}
                  onClick={() => jumpToModule(index)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm line-clamp-2">
                        {module.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {module.estimated_duration_minutes} min
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ModuleIcon className="h-6 w-6" />
              <div className="flex-1">
                <CardTitle>{currentModule?.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {currentModule?.estimated_duration_minutes} minutes
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {currentModule?.module_type}
                  </Badge>
                  {currentModule?.is_required && (
                    <Badge variant="secondary">Required</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Module Description */}
            {currentModule?.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{currentModule.description}</p>
              </div>
            )}

            <Separator />

            {/* Module Content */}
            <div className="prose max-w-none">
              <h4 className="font-medium mb-4">Content</h4>
              <div className="bg-muted/50 rounded-lg p-6">
                {currentModule?.content ? (
                  <div className="whitespace-pre-wrap">{currentModule.content}</div>
                ) : (
                  <p className="text-muted-foreground italic">No content available for this module.</p>
                )}
              </div>
            </div>

            {/* Resources */}
            {currentModule?.resources && Array.isArray(currentModule.resources) && currentModule.resources.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Resources</h4>
                <div className="space-y-2">
                  {currentModule.resources.map((resource: any, index: number) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{resource.title}</div>
                          <div className="text-xs text-muted-foreground capitalize">{resource.type}</div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            Open
                          </a>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentModuleIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {!isModuleComplete && (
                  <Button onClick={handleCompleteModule}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete Module
                  </Button>
                )}
                
                <Button
                  onClick={handleNext}
                  disabled={currentModuleIndex === (modules?.length || 0) - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
