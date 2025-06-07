
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, Library, Wand2, BarChart3, Brain, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ContentCreationCard() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Enhanced Content Creation
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            UPGRADED
          </Badge>
        </CardTitle>
        <CardDescription>
          Create C-suite quality content with AI intelligence and knowledge base integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-primary/5 hover:bg-primary/10 border-primary/20"
            onClick={() => navigate('/content-generator')}
          >
            <div className="flex items-center w-full">
              <Wand2 className="h-4 w-4 mr-2" />
              <div className="flex-1 text-left">
                <div className="font-medium">Enhanced AI Generator</div>
                <div className="text-xs text-muted-foreground">Executive-level content with knowledge integration</div>
              </div>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/content-library')}
          >
            <Library className="h-4 w-4 mr-2" />
            Content Library
            <ExternalLink className="h-3 w-3 ml-auto" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/content-analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Content Analytics
            <ExternalLink className="h-3 w-3 ml-auto" />
          </Button>

          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3 text-primary" />
                <span>Knowledge base integration</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-primary" />
                <span>Executive-level content types</span>
              </div>
              <div className="flex items-center gap-1">
                <Wand2 className="h-3 w-3 text-primary" />
                <span>Advanced personalization & prompts</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
