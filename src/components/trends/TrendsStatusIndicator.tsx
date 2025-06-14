
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Loader2,
  Clock,
  Globe
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
      <Alert className="border-blue-200 bg-blue-50">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <AlertDescription className="flex items-center gap-2">
          <span className="font-medium text-blue-800">Obteniendo tendencias...</span>
          <span className="text-blue-600">Conectando con Reddit API</span>
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    const isAuthError = error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('authentication');
    const isCredentialsError = error.message.includes('credentials') || error.message.includes('REDDIT_CLIENT');
    
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription>
          <div className="space-y-2">
            <div className="font-medium text-red-800">Error al obtener tendencias</div>
            {isCredentialsError ? (
              <div className="text-red-700">
                Las credenciales de Reddit no están configuradas correctamente. 
                Contacta al administrador para configurar REDDIT_CLIENT_ID y REDDIT_CLIENT_SECRET.
              </div>
            ) : isAuthError ? (
              <div className="text-red-700">
                Error de autenticación con Reddit API. Las credenciales pueden ser inválidas o haber expirado.
              </div>
            ) : (
              <div className="text-red-700">
                {error.message.length > 100 ? `${error.message.substring(0, 100)}...` : error.message}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (metadata) {
    const isSuccess = metadata.successful_subreddits > 0;
    const hasPartialFailure = metadata.successful_subreddits < metadata.subreddits?.length;
    
    return (
      <Alert className={`${isSuccess ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        {isSuccess ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-yellow-600" />
        )}
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isSuccess ? 'text-green-800' : 'text-yellow-800'}`}>
                  {isSuccess ? 'Tendencias obtenidas exitosamente' : 'Obtención parcial de tendencias'}
                </span>
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  {metadata.api_method === 'reddit_oauth_api' ? 'API Oficial' : 'API Pública'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {metadata.successful_subreddits} de {metadata.subreddits?.length || 0} subreddits procesados
                {hasPartialFailure && ' • Algunos subreddits no respondieron'}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{new Date(metadata.generated_at).toLocaleTimeString()}</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
