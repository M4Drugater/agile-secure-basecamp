
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

interface RealTimeSearchStatusProps {
  searchData?: any;
  searchError?: string | null;
  isSearching?: boolean;
  onRetry?: () => void;
}

export function RealTimeSearchStatus({ 
  searchData, 
  searchError, 
  isSearching,
  onRetry 
}: RealTimeSearchStatusProps) {
  if (!searchData && !searchError && !isSearching) {
    return null;
  }

  const isApiConfigured = searchData?.metadata?.apiProvider !== 'mock';
  const isFallbackMode = searchData?.metadata?.apiProvider === 'fallback';
  const dataConfidence = searchData?.metadata?.dataConfidence || 0;

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {isApiConfigured ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-yellow-500" />
            )}
            Real-Time Intelligence Status
            {isSearching && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Searching...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isApiConfigured ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">
                    Configuration Required
                  </span>
                </div>
              ) : isFallbackMode ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-muted-foreground">
                    Fallback Mode Active
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    Live Intelligence Active
                  </span>
                </div>
              )}
              
              {searchData && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-muted-foreground">
                      Confidence: {Math.round(dataConfidence * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(searchData.metadata?.timestamp || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                </>
              )}
            </div>

            {(searchError || isFallbackMode) && onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Alerts */}
      {!isApiConfigured && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>API Configuration Required:</strong> To enable real-time web search, please configure the Perplexity API key in your Supabase Edge Function secrets. The system is currently operating with mock data.
          </AlertDescription>
        </Alert>
      )}

      {searchError && !isFallbackMode && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Search Error:</strong> {searchError}. The system has activated fallback mode to maintain functionality.
          </AlertDescription>
        </Alert>
      )}

      {isFallbackMode && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Fallback Mode:</strong> Real-time search is temporarily unavailable. The system continues operating with core intelligence capabilities.
          </AlertDescription>
        </Alert>
      )}

      {/* Search Results Summary */}
      {searchData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Insights</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {searchData.insights?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Detected
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Threats</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {searchData.threats?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Identified
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Opportunities</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {searchData.opportunities?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Discovered
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Sources</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {searchData.metadata?.sources?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Referenced
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Metadata */}
      {searchData?.metadata && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Search Metadata</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span>
                <div className="text-muted-foreground capitalize">
                  {searchData.metadata.searchType}
                </div>
              </div>
              <div>
                <span className="font-medium">Timeframe:</span>
                <div className="text-muted-foreground">
                  {searchData.metadata.timeframe}
                </div>
              </div>
              <div>
                <span className="font-medium">Company:</span>
                <div className="text-muted-foreground">
                  {searchData.metadata.companyName}
                </div>
              </div>
              <div>
                <span className="font-medium">Model:</span>
                <div className="text-muted-foreground">
                  {searchData.metadata.model}
                </div>
              </div>
              <div>
                <span className="font-medium">Provider:</span>
                <div className="text-muted-foreground capitalize">
                  {searchData.metadata.apiProvider}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
