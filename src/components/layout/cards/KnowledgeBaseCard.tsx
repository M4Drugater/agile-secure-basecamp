
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

export function KnowledgeBaseCard() {
  const navigate = useNavigate();
  const { documents } = useKnowledgeBase();

  const documentCount = documents?.length || 0;
  const hasDocuments = documentCount > 0;

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
              {hasDocuments 
                ? `${documentCount} document${documentCount !== 1 ? 's' : ''} in your knowledge base`
                : 'Build your personal knowledge repository'
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasDocuments ? (
            <div className="text-sm text-muted-foreground">
              Recent documents, notes, and references ready for AI-powered insights
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Store documents, notes, and references to enhance CLIPOGINO's personalized advice
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/knowledge-base')}
          >
            {hasDocuments ? (
              <>
                Manage Documents
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Add First Document
                <Plus className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
