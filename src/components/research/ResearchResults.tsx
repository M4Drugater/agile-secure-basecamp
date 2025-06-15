
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  ExternalLink, 
  Brain, 
  Target, 
  Lightbulb,
  TrendingUp,
  BookOpen,
  Download
} from 'lucide-react';
import { ResearchSession } from '@/hooks/research/useEliteResearchEngine';
import { format } from 'date-fns';

interface ResearchResultsProps {
  session: ResearchSession;
}

export function ResearchResults({ session }: ResearchResultsProps) {
  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return 'text-green-600 bg-green-50';
    if (effectiveness >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getResearchTypeLabel = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleDownload = () => {
    const content = `# ${session.query}\n\n${session.content}\n\n## Sources\n${session.sources.map(s => `- [${s.title}](${s.url})`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-${session.query.slice(0, 50)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{session.query}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{format(new Date(session.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                <Badge variant="outline">{getResearchTypeLabel(session.researchType)}</Badge>
                {session.industry && <Badge variant="secondary">{session.industry}</Badge>}
                <Badge variant="outline">{session.contextQuality}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEffectivenessColor(session.effectiveness)}`}>
                {session.effectiveness}% Effective
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Research Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{session.sources.length}</div>
            <div className="text-sm text-muted-foreground">Sources Found</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{session.insights.length}</div>
            <div className="text-sm text-muted-foreground">Key Insights</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{session.creditsUsed}</div>
            <div className="text-sm text-muted-foreground">Credits Used</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{session.metadata.confidenceScore}%</div>
            <div className="text-sm text-muted-foreground">Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      {session.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Key Strategic Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {session.insights.map((insight, index) => (
              <Alert key={index}>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {insight}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Research Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {session.content}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      {session.sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-green-500" />
              Research Sources ({session.sources.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.sources.map((source, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {source.sourceType}
                  </Badge>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium text-sm">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {source.title}
                    </a>
                  </h4>
                  <p className="text-xs text-muted-foreground">{source.snippet}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{source.domain}</span>
                    <span>•</span>
                    <span>Credibility: {Math.round(source.credibilityScore * 100)}%</span>
                    <span>•</span>
                    <span>Relevance: {Math.round(source.relevance * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Keywords */}
      {session.keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Research Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {session.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
