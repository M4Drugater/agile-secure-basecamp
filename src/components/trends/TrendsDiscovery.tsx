
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  RefreshCw, 
  Plus, 
  X, 
  ExternalLink,
  MessageSquare,
  ArrowUp,
  Clock,
  Users,
  Search,
  Settings,
  Info
} from 'lucide-react';
import { useRedditTrends } from '@/hooks/useRedditTrends';
import { RedditTrendCard } from './RedditTrendCard';
import { TrendsFilters } from './TrendsFilters';
import { TrendsSettings } from './TrendsSettings';
import { TrendsStatusIndicator } from './TrendsStatusIndicator';

export function TrendsDiscovery() {
  const [newSubreddit, setNewSubreddit] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    trends, 
    metadata, 
    isLoading, 
    error, 
    refetch, 
    params,
    updateParams,
    addSubreddit,
    removeSubreddit 
  } = useRedditTrends();

  const handleAddSubreddit = () => {
    if (newSubreddit.trim() && !params.subreddits.includes(newSubreddit.trim())) {
      addSubreddit(newSubreddit.trim());
      setNewSubreddit('');
    }
  };

  const filteredTrends = trends.filter(trend =>
    trend.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trend.selftext.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() / 1000 - timestamp) / 3600);
    if (hours < 1) return 'menos de 1h';
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            Descubrimiento de Tendencias
          </h1>
          <p className="text-muted-foreground mt-2">
            Descubre tendencias emergentes en Reddit usando la API oficial
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button
            onClick={() => refetch()}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Status Indicator */}
      <TrendsStatusIndicator 
        metadata={metadata}
        isLoading={isLoading}
        error={error}
      />

      {/* Settings Panel */}
      {showSettings && (
        <TrendsSettings
          params={params}
          onUpdateParams={updateParams}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Subreddits Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Subreddits Monitoreados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {params.subreddits.map((subreddit) => (
              <Badge key={subreddit} variant="secondary" className="text-sm">
                r/{subreddit}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 ml-2 p-0"
                  onClick={() => removeSubreddit(subreddit)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Agregar subreddit (ej: technology)"
              value={newSubreddit}
              onChange={(e) => setNewSubreddit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubreddit()}
              className="flex-1"
            />
            <Button onClick={handleAddSubreddit} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Information */}
      {metadata && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">Información de la consulta:</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Método API:</span> 
                  <span className="ml-1 font-medium">
                    {metadata.api_method === 'reddit_oauth_api' ? 'OAuth Oficial' : 'API Pública'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Resultados:</span> 
                  <span className="ml-1 font-medium">{metadata.total_results}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Período:</span> 
                  <span className="ml-1 font-medium">{metadata.timeframe}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Calidad:</span> 
                  <span className="ml-1 font-medium">Filtrado y Validado</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Última actualización: {new Date(metadata.generated_at).toLocaleString()}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en tendencias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <TrendsFilters
          params={params}
          onUpdateParams={updateParams}
        />
      </div>

      {/* Trends Grid */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Vista de Cuadrícula</TabsTrigger>
          <TabsTrigger value="list">Vista de Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-20 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTrends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrends.map((trend) => (
                <RedditTrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron tendencias</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {metadata?.successful_subreddits === 0 
                    ? 'No se pudieron obtener datos de Reddit. Verifica la configuración de la API.'
                    : 'Ajusta los filtros o agrega más subreddits para descubrir tendencias'
                  }
                </p>
                <Button onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Intentar de nuevo
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-2">
          {filteredTrends.map((trend) => (
            <Card key={trend.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">r/{trend.subreddit}</Badge>
                      <span className="text-sm text-muted-foreground">
                        u/{trend.author} • {getTimeAgo(trend.created_utc)}
                      </span>
                    </div>
                    <h3 className="font-semibold leading-tight">{trend.title}</h3>
                    {trend.selftext && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {trend.selftext.substring(0, 200)}...
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      {trend.score}
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <MessageSquare className="h-4 w-4" />
                      {trend.num_comments}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a 
                        href={`https://reddit.com${trend.permalink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
