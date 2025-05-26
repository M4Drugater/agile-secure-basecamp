
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Library, Wand2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ContentCreationCard() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Content Creation
        </CardTitle>
        <CardDescription>Create and manage professional content with AI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/content-generator')}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            AI Content Generator
            <ExternalLink className="h-3 w-3 ml-auto" />
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
          <div className="text-xs text-muted-foreground">
            Generate, organize and track all your professional content in one place.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
