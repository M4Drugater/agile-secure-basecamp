
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
  Hash,
  Clock,
  Brain,
  Link as LinkIcon,
  Globe,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';
import { ResearchSession } from '@/hooks/usePerplexityResearch';

interface ResearchResultsProps {
  session: ResearchSession;
}

export function ResearchResults({ session }: ResearchResultsProps) {
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleCopyInsight = (insight: string) => {
    navigator.clipboard.writeText(insight);
  };

  const handleCopyAllSources = () => {
    const sourcesList = session.sources.map((source, index) => 
      `${index + 1}. ${source.title}\n   ${source.url}\n   ${source.snippet}\n`
    ).join('\n');
    navigator.clipboard.writeText(sourcesList);
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
                Fuentes de Investigación
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Consulta: "{session.query}"
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{session.researchType}</Badge>
              <Badge variant="secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                {session.sources?.length || 0} fuentes
              </Badge>
              <Badge variant="secondary">{session.creditsUsed} créditos</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Live Sources - Priority Section */}
      {session.sources && session.sources.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-green-500" />
                Fuentes Verificadas ({session.sources.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopyAllSources}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Todas las Fuentes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {session.sources.map((source, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm line-clamp-2 flex-1">
                          {source.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(source.relevance * 100)}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        <span className="font-mono">{source.domain || new URL(source.url).hostname}</span>
                        {source.publishDate && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <Calendar className="h-3 w-3" />
                            <span>{source.publishDate}</span>
                          </>
                        )}
                        {source.author && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <User className="h-3 w-3" />
                            <span>{source.author}</span>
                          </>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {source.snippet}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="default" 
                          size="sm" 
                          asChild
                          className="flex-1"
                        >
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Abrir Fuente
                          </a>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCopyLink(source.url)}
                          className="px-3"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Insights */}
      {session.insights && session.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Insights Clave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {session.insights.map((insight, index) => (
                <Card key={index} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Keywords */}
        {session.keywords && session.keywords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-purple-500" />
                Palabras Clave
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
              Información de la Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tipo de Investigación:</span>
              <Badge variant="outline">{session.researchType}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Modelo Usado:</span>
              <span className="font-mono text-xs">{session.modelUsed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Créditos Usados:</span>
              <span className="font-semibold">{session.creditsUsed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fuentes Encontradas:</span>
              <span className="font-semibold">{session.sources?.length || 0}</span>
            </div>
            {session.industry && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Industria:</span>
                <Badge variant="outline">{session.industry}</Badge>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Realizada:</span>
              <span>{new Date(session.createdAt).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Summary - Compact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumen de Investigación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
              {session.content.length > 500 ? 
                `${session.content.substring(0, 500)}...` : 
                session.content
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
