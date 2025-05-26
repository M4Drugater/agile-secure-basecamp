
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Database, Download, FileText, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';
import { useSystemKnowledge } from '@/hooks/useSystemKnowledge';
import { useDownloadableResources } from '@/hooks/useDownloadableResources';

export function KnowledgeBaseCard() {
  const navigate = useNavigate();
  const { files } = useUserKnowledgeFiles();
  const { documents } = useSystemKnowledge();
  const { resources } = useDownloadableResources();

  const personalCount = files?.length || 0;
  const systemCount = documents?.length || 0;
  const resourceCount = resources?.length || 0;
  const totalCount = personalCount + systemCount + resourceCount;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              3-Tier Knowledge Base
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardTitle>
            <CardDescription>
              {totalCount > 0 
                ? `${totalCount} total items • AI-integrated with CLIPOGINO`
                : 'Advanced AI-integrated knowledge management system'
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium">{personalCount}</div>
                <div className="text-xs text-muted-foreground">Personal</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
              <Database className="h-4 w-4 text-purple-600" />
              <div>
                <div className="font-medium">{systemCount}</div>
                <div className="text-xs text-muted-foreground">System</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
              <Download className="h-4 w-4 text-orange-600" />
              <div>
                <div className="font-medium">{resourceCount}</div>
                <div className="text-xs text-muted-foreground">Resources</div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {totalCount > 0 ? (
              <>
                <div className="flex items-center gap-1 text-green-600 font-medium mb-1">
                  <Zap className="h-3 w-3" />
                  CLIPOGINO Integration Active
                </div>
                Smart context retrieval and AI-powered recommendations during conversations
              </>
            ) : (
              'Personal files, system frameworks, and downloadable resources with AI integration'
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/knowledge-base')}
          >
            Access Knowledge Base
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
