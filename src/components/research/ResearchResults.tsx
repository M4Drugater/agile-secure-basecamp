
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Copy, 
  FileText, 
  Lightbulb, 
  TrendingUp,
  Hash,
  Clock,
  Brain
} from 'lucide-react';
import { ResearchSession } from '@/hooks/usePerplexityResearch';

interface ResearchResultsProps {
  session: ResearchSession;
}

export function ResearchResults({ session }: ResearchResultsProps) {
  const handleCopyContent = () => {
    navigator.clipboard.writeText(session.content);
  };

  const handleCopyInsight = (insight: string) => {
    navigator.clipboard.writeText(insight);
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                Research Results
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Query: "{session.query}"
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{session.researchType}</Badge>
              <Badge variant="secondary">{session.creditsUsed} credits</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Research Analysis
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopyContent}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Content
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {session.content}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {session.insights && session.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {session.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm">{insight}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopyInsight(insight)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sources */}
        {session.sources && session.sources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-green-500" />
                Sources ({session.sources.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {session.sources.map((source, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {source.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(source.relevance * 100)}% relevant
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {source.snippet}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="h-6 text-xs"
                    >
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Source
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keywords & Metadata */}
        <div className="space-y-4">
          {/* Keywords */}
          {session.keywords && session.keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-purple-500" />
                  Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {session.keywords.slice(0, 10).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                Session Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Research Type:</span>
                <Badge variant="outline">{session.researchType}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Model Used:</span>
                <span className="font-mono text-xs">{session.modelUsed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credits Used:</span>
                <span className="font-semibold">{session.creditsUsed}</span>
              </div>
              {session.industry && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Industry:</span>
                  <Badge variant="outline">{session.industry}</Badge>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conducted:</span>
                <span>{new Date(session.createdAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
