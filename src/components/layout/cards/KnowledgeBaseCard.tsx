
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';

export function KnowledgeBaseCard() {
  const navigate = useNavigate();
  const { files } = useUserKnowledgeFiles();

  const fileCount = files?.length || 0;
  const hasFiles = fileCount > 0;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Knowledge Base</CardTitle>
            <CardDescription>
              {hasFiles 
                ? `${fileCount} knowledge file${fileCount !== 1 ? 's' : ''} in your personal library`
                : 'Build your personal knowledge repository'
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasFiles ? (
            <div className="text-sm text-muted-foreground">
              Personal knowledge files ready for AI-powered insights and referencing
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Store your personal knowledge, notes, and references to enhance CLIPOGINO's advice
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/knowledge-base')}
          >
            {hasFiles ? (
              <>
                Manage Knowledge
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Add First Knowledge File
                <Plus className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
