
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export function UnifiedSystemStatus() {
  return (
    <>
      <Alert className="border-green-200 bg-green-50 mb-6">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          ✅ <strong>Sistema Tripartite Unificado Activo</strong> - Todos los agentes implementan la misma metodología para garantizar consistencia, calidad y métricas comparables.
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-2">
        <Badge variant="default">Metodología Unificada</Badge>
        <Badge variant="default">Flujo Tripartite</Badge>
        <Badge variant="default">Métricas Consistentes</Badge>
        <Badge variant="default">Calidad Garantizada</Badge>
      </div>
    </>
  );
}
