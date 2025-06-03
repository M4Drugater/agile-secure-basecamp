
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Sparkles, 
  Target, 
  Clock,
  Plus,
  X
} from 'lucide-react';
import { useAILearningEnhancement } from '@/hooks/useAILearningEnhancement';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface SmartLearningPathGeneratorProps {
  onPathGenerated?: (pathData: any) => void;
}

export function SmartLearningPathGenerator({ onPathGenerated }: SmartLearningPathGeneratorProps) {
  const { generateSmartLearningPath, isAnalyzing } = useAILearningEnhancement();
  const [goals, setGoals] = useState<string[]>([]);
  const [currentGoal, setCurrentGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [description, setDescription] = useState('');

  const addGoal = () => {
    if (currentGoal.trim() && !goals.includes(currentGoal.trim())) {
      setGoals([...goals, currentGoal.trim()]);
      setCurrentGoal('');
    }
  };

  const removeGoal = (goalToRemove: string) => {
    setGoals(goals.filter(goal => goal !== goalToRemove));
  };

  const handleGenerate = async () => {
    if (goals.length === 0 || !skillLevel) return;
    
    const pathData = await generateSmartLearningPath(goals, skillLevel);
    if (pathData && onPathGenerated) {
      onPathGenerated(pathData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Learning Path Generator
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning Goals */}
        <div className="space-y-3">
          <Label htmlFor="goals">Learning Goals</Label>
          <div className="flex gap-2">
            <Input
              id="goals"
              placeholder="Add a learning goal..."
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            <Button onClick={addGoal} size="sm" disabled={!currentGoal.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {goals.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {goals.map((goal, index) => (
                <Badge key={index} variant="outline" className="pr-1">
                  {goal}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeGoal(goal)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Skill Level */}
        <div className="space-y-2">
          <Label>Current Skill Level</Label>
          <Select value={skillLevel} onValueChange={setSkillLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select your skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Context */}
        <div className="space-y-2">
          <Label htmlFor="description">Additional Context (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Provide any additional context about your learning needs, preferences, or constraints..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate} 
          disabled={goals.length === 0 || !skillLevel || isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <LoadingSpinner text="Generating personalized path..." />
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Generate AI Learning Path
            </>
          )}
        </Button>

        {/* Info */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3" />
            <span className="font-medium">AI-Powered Personalization</span>
          </div>
          <p>
            Our AI will analyze your goals, skill level, and learning preferences to create a 
            personalized learning path tailored specifically for you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
