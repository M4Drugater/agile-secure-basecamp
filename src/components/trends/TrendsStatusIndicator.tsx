
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Wifi,
  WifiOff
} from 'lucide-react';
import { TrendsMetadata } from '@/hooks/useRedditTrends';

interface TrendsStatusIndicatorProps {
  metadata?: TrendsMetadata;
  isLoading: boolean;
  error?: Error | null;
}

export function TrendsStatusIndicator({ metadata, isLoading, error }: TrendsStatusIndicatorProps) {
  if (isLoading) {
    return (
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Obteniendo tendencias de Reddit usando la API oficial...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          Error al conectar con Reddit API: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!metadata) return null;

  const getStatusColor = (successRate: string) => {
    const rate = parseFloat(successRate);
    if (rate >= 80) return 'bg-green-100 text-green-800';
    if (rate >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getApiMethodBadge = (method: string) => {
    if (method === 'reddit_oauth_api') {
      return <Badge variant="default" className="bg-blue-100 text-blue-800">API Oficial</Badge>;
    }
    return <Badge variant="secondary">API Pública</Badge>;
  };

  return (
    <div className="space-y-3">
      <Alert>
        <Wifi className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center gap-2 flex-wrap">
            <span>Estado de conexión:</span>
            {getApiMethodBadge(metadata.api_method)}
            <Badge className={getStatusColor(metadata.success_rate)}>
              {metadata.success_rate} éxito
            </Badge>
            <span className="text-sm text-muted-foreground">
              {metadata.successful_subreddits}/{metadata.subreddits.length} subreddits activos
            </span>
            {metadata.rate_limit_status === 'limited' && (
              <Badge variant="destructive">Rate Limited</Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {metadata.successful_subreddits === 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No se pudieron obtener datos de ningún subreddit. 
            Esto puede deberse a problemas de conectividad o restricciones de la API.
            Por favor, intenta de nuevo en unos minutos.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
