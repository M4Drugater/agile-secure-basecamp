
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Brain,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAILearningEnhancement, AdaptiveDifficultyAdjustment } from '@/hooks/useAILearningEnhancement';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AdaptiveDifficultyIndicatorProps {
  learningPathId: string;
  moduleId?: string;
  onDifficultyAdjust?: (adjustment: AdaptiveDifficultyAdjustment) => void;
}

const difficultyLevels = {
  beginner: { label: 'Beginner', color: 'bg-green-500', value: 1 },
  intermediate: { label: 'Intermediate', color: 'bg-yellow-500', value: 2 },
  advanced: { label: 'Advanced', color: 'bg-orange-500', value: 3 },
  expert: { label: 'Expert', color: 'bg-red-500', value: 4 },
};

export function AdaptiveDifficultyIndicator({
  learningPathId,
  moduleId,
  onDifficultyAdjust
}: AdaptiveDifficultyIndicatorProps) {
  const { analyzeDifficultyAdjustment } = useAILearningEnhancement();
  const [difficultyAnalysis, setDifficultyAnalysis] = useState<AdaptiveDifficultyAdjustment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const performAnalysis = async () => {
      setIsAnalyzing(true);
      const analysis = await analyzeDifficultyAdjustment(learningPathId, moduleId);
      setDifficultyAnalysis(analysis);
      setIsAnalyzing(false);
    };

    performAnalysis();
  }, [learningPathId, moduleId, analyzeDifficultyAdjustment]);

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="py-6">
          <LoadingSpinner text="Analyzing difficulty level..." />
        </CardContent>
      </Card>
    );
  }

  if (!difficultyAnalysis) {
    return null;
  }

  const currentLevel = difficultyLevels[difficultyAnalysis.currentDifficulty];
  const recommendedLevel = difficultyLevels[difficultyAnalysis.recommendedDifficulty];
  const needsAdjustment = difficultyAnalysis.currentDifficulty !== difficultyAnalysis.recommendedDifficulty;
  const isIncreasing = recommendedLevel.value > currentLevel.value;

  return (
    <Card className={needsAdjustment ? "border-yellow-200 bg-yellow-50/50" : ""}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4 text-purple-600" />
          Adaptive Difficulty Analysis
          {needsAdjustment && (
            <Badge variant="outline" className="ml-auto">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Adjustment Suggested
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current vs Recommended Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Current Level</div>
            <Badge variant="outline" className="w-full justify-center">
              <div className={`w-2 h-2 rounded-full ${currentLevel.color} mr-2`} />
              {currentLevel.label}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Recommended Level</div>
            <Badge variant={needsAdjustment ? "default" : "outline"} className="w-full justify-center">
              <div className={`w-2 h-2 rounded-full ${recommendedLevel.color} mr-2`} />
              {recommendedLevel.label}
              {needsAdjustment && (
                isIncreasing ? 
                  <TrendingUp className="h-3 w-3 ml-1" /> : 
                  <TrendingDown className="h-3 w-3 ml-1" />
              )}
            </Badge>
          </div>
        </div>

        {/* Confidence and Reasoning */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="font-medium">{Math.round(difficultyAnalysis.confidence * 100)}%</span>
          </div>
          <Progress value={difficultyAnalysis.confidence * 100} className="h-2" />
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <div className="font-medium mb-1">Analysis Reasoning:</div>
          <p>{difficultyAnalysis.reasoning}</p>
        </div>

        {/* Performance Factors */}
        <div className="space-y-2">
          <div className="text-xs font-medium">Performance Factors</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Completion Rate:</span>
              <span className="font-medium">
                {Math.round(difficultyAnalysis.adjustmentFactors.completionRate * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time Efficiency:</span>
              <span className="font-medium">
                {Math.round(difficultyAnalysis.adjustmentFactors.timeSpent * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Assessment Scores:</span>
              <span className="font-medium">
                {Math.round(difficultyAnalysis.adjustmentFactors.assessmentScores * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Struggling Areas */}
        {difficultyAnalysis.adjustmentFactors.strugglingAreas.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium">Areas for Improvement</div>
            <div className="flex flex-wrap gap-1">
              {difficultyAnalysis.adjustmentFactors.strugglingAreas.map((area, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {needsAdjustment && onDifficultyAdjust && (
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onDifficultyAdjust(difficultyAnalysis)}
          >
            <Target className="h-4 w-4 mr-2" />
            Apply Difficulty Adjustment
          </Button>
        )}

        {!needsAdjustment && (
          <div className="flex items-center justify-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            Difficulty level is optimal for your progress
          </div>
        )}
      </CardContent>
    </Card>
  );
}
