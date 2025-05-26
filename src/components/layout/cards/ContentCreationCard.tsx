
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
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
        <CardDescription>Generate professional content with AI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/content-generator')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Content
            <ExternalLink className="h-3 w-3 ml-auto" />
          </Button>
          <div className="text-xs text-muted-foreground">
            Create resumes, cover letters, and other professional documents.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
