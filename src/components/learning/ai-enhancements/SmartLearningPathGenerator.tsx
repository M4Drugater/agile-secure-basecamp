
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wand2, 
  Target, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Plus,
  X,
  Sparkles
} from 'lucide-react';
import { useAILearningEnhancement } from '@/hooks/useAILearningEnhancement';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface SmartLearningPathGeneratorProps {
  onPathGenerated?: (pathData: any) => void;
}

export function SmartLearningPathGenerator({ onPathGenerated }: SmartLearningPathGeneratorProps) {
  const { generateSmartLearningPath, isAnalyzing } = useAILearningEnhancement();
  
  const [goals, setGoals] = useState<string[]>(['']);
  const [skillLevel, setSkillLevel] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [generatedPath, setGeneratedPath] = useState<any>(null);

  const addGoal = () => {
    setGoals([...goals, '']);
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  const handleGenerate = async () => {
    const validGoals = goals.filter(goal => goal.trim() !== '');
    
    if (validGoals.length === 0 || !skillLevel) {
      return;
    }

    const pathData = await generateSmartLearningPath(validGoals, skillLevel);
    
    if (pathData) {
      setGeneratedPath(pathData);
      onPathGenerated?.(pathData);
    }
  };

  const resetForm = () => {
    setGoals(['']);
    setSkillLevel('');
    setFocusArea('');
    setTimeCommitment('');
    setLearningStyle('');
    setGeneratedPath(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            AI Learning Path Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Learning Goals */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Learning Goals *</Label>
            {goals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g., Master React development, Learn data science fundamentals"
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                />
                {goals.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGoal(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>

          {/* Skill Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Skill Level *</Label>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select your skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - New to the topic</SelectItem>
                <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                <SelectItem value="advanced">Advanced - Considerable experience</SelectItem>
                <SelectItem value="expert">Expert - Highly experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Focus Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Primary Focus Area</Label>
            <Select value={focusArea} onValueChange={setFocusArea}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your focus area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical-skills">Technical Skills</SelectItem>
                <SelectItem value="leadership">Leadership & Management</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="business-skills">Business Skills</SelectItem>
                <SelectItem value="creative-skills">Creative Skills</SelectItem>
                <SelectItem value="personal-development">Personal Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Commitment */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Time Commitment</Label>
            <Select value={timeCommitment} onValueChange={setTimeCommitment}>
              <SelectTrigger>
                <SelectValue placeholder="How much time can you dedicate?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light - 1-2 hours/week</SelectItem>
                <SelectItem value="moderate">Moderate - 3-5 hours/week</SelectItem>
                <SelectItem value="intensive">Intensive - 6-10 hours/week</SelectItem>
                <SelectItem value="full-time">Full-time - 10+ hours/week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Learning Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preferred Learning Style</Label>
            <Select value={learningStyle} onValueChange={setLearningStyle}>
              <SelectTrigger>
                <SelectValue placeholder="How do you learn best?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual - Videos, diagrams, charts</SelectItem>
                <SelectItem value="hands-on">Hands-on - Practice, exercises, projects</SelectItem>
                <SelectItem value="reading">Reading - Articles, documentation, books</SelectItem>
                <SelectItem value="interactive">Interactive - Discussions, Q&A, mentoring</SelectItem>
                <SelectItem value="mixed">Mixed - Combination of styles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button 
              onClick={handleGenerate} 
              disabled={isAnalyzing || goals.filter(g => g.trim()).length === 0 || !skillLevel}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating AI Path...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Smart Learning Path
                </>
              )}
            </Button>
            
            {generatedPath && (
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Path Preview */}
      {generatedPath && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Generated Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{generatedPath.title}</h3>
              <p className="text-muted-foreground">{generatedPath.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {generatedPath.estimatedDuration}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {generatedPath.difficulty}
              </Badge>
              <Badge variant="outline">
                {generatedPath.modules?.length || 0} modules
              </Badge>
            </div>

            <Separator />

            {/* Learning Objectives */}
            {generatedPath.learningObjectives && (
              <div>
                <h4 className="font-medium mb-2">Learning Objectives</h4>
                <ul className="space-y-1">
                  {generatedPath.learningObjectives.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Module Overview */}
            {generatedPath.modules && (
              <div>
                <h4 className="font-medium mb-2">Module Overview</h4>
                <div className="space-y-2">
                  {generatedPath.modules.map((module: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{module.title}</div>
                        <div className="text-xs text-muted-foreground">{module.description}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {module.estimatedDuration}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full" size="lg">
              <BookOpen className="h-4 w-4 mr-2" />
              Create This Learning Path
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
