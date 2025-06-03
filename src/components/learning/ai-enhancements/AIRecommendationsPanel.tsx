
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  TrendingUp, 
  Brain, 
  Target,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Award
} from 'lucide-react';
import { useAILearningEnhancement, AIRecommendation } from '@/hooks/useAILearningEnhancement';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AIRecommendationsPanelProps {
  learningPathId?: string;
  onRecommendationSelect?: (recommendation: AIRecommendation) => void;
}

export function AIRecommendationsPanel({ 
  learningPathId, 
  onRecommendationSelect 
}: AIRecommendationsPanelProps) {
  const { 
    isAnalyzing, 
    recommendations, 
    generatePersonalizedRecommendations 
  } = useAILearningEnhancement();
  
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    generatePersonalizedRecommendations(learningPathId);
  }, [learningPathId, generatePersonalizedRecommendations]);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'learning_path': return BookOpen;
      case 'module': return Target;
      case 'resource': return Award;
      default: return Lightbulb;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const displayedRecommendations = showAll ? recommendations : recommendations.slice(0, 3);

  if (isAnalyzing && recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner text="Analyzing your learning patterns..." />
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Complete more learning activities to receive personalized AI recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Recommendations
          <Badge variant="secondary" className="ml-auto">
            {recommendations.length} suggestions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedRecommendations.map((recommendation, index) => {
          const Icon = getRecommendationIcon(recommendation.type);
          
          return (
            <div key={recommendation.id} className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                  <Icon className="h-4 w-4 text-purple-600" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm leading-relaxed">
                      {recommendation.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-2 h-2 rounded-full ${getConfidenceColor(recommendation.confidence)}`}
                        title={`${Math.round(recommendation.confidence * 100)}% confidence`}
                      />
                      <Badge variant="outline" className="text-xs capitalize">
                        {recommendation.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>{recommendation.reasoning}</span>
                  </div>
                  
                  {onRecommendationSelect && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2 text-xs"
                      onClick={() => onRecommendationSelect(recommendation)}
                    >
                      Explore
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
              
              {index < displayedRecommendations.length - 1 && <Separator />}
            </div>
          );
        })}
        
        {recommendations.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show ${recommendations.length - 3} More`}
          </Button>
        )}
        
        <div className="pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => generatePersonalizedRecommendations(learningPathId)}
            disabled={isAnalyzing}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
