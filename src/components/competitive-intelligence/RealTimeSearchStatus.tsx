
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  BarChart3,
  Target
} from 'lucide-react';

interface RealTimeSearchStatusProps {
  searchData?: any;
  searchError?: string | null;
  isSearching?: boolean;
}

export function RealTimeSearchStatus({ searchData, searchError, isSearching }: RealTimeSearchStatusProps) {
  if (!searchData && !searchError && !isSearching) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-blue-500" />
            Estado de Búsqueda en Tiempo Real
            {isSearching && <Badge variant="secondary">Buscando...</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-green-500" />
                <span className="text-xs text-muted-foreground">Web Search Activo</span>
              </div>
              
              {searchData && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    Confianza: {(searchData.metadata?.dataConfidence * 100 || 0).toFixed(0)}%
                  </span>
                </div>
              )}
              
              {searchData && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(searchData.metadata?.timestamp || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Error */}
      {searchError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error en búsqueda web:</strong> {searchError}
          </AlertDescription>
        </Alert>
      )}

      {/* Search Results Summary */}
      {searchData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Insights</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {searchData.insights?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Detectados en tiempo real
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Amenazas</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {searchData.threats?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Identificadas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Oportunidades</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {searchData.opportunities?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Descubiertas
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Metadata */}
      {searchData?.metadata && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Metadatos de Búsqueda</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Tipo:</span>
                <div className="text-muted-foreground capitalize">
                  {searchData.metadata.searchType}
                </div>
              </div>
              <div>
                <span className="font-medium">Periodo:</span>
                <div className="text-muted-foreground">
                  {searchData.metadata.timeframe}
                </div>
              </div>
              <div>
                <span className="font-medium">Empresa:</span>
                <div className="text-muted-foreground">
                  {searchData.metadata.companyName}
                </div>
              </div>
              <div>
                <span className="font-medium">Fuentes:</span>
                <div className="text-muted-foreground">
                  {searchData.metadata.sources?.length || 0} fuentes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
