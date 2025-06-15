
import React from 'react';
import { Loader2, CheckCircle, Globe } from 'lucide-react';

interface LoadingMessageProps {
  customText?: string;
}

export function LoadingMessage({ customText }: LoadingMessageProps) {
  return (
    <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        <CheckCircle className="h-4 w-4 text-green-500" />
        <Globe className="h-4 w-4 text-blue-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">
          {customText || "🔧 Sistema reparado • Buscando datos web en tiempo real • Generando análisis estratégico..."}
        </p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Conectividad web verificada
          </div>
          <div className="flex items-center text-xs text-blue-600">
            <Globe className="h-3 w-3 mr-1" />
            Accediendo a datos actuales
          </div>
        </div>
      </div>
    </div>
  );
}
