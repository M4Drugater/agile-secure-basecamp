
import React from 'react';
import { Crown } from 'lucide-react';
import { UnifiedSystemStatus } from './UnifiedSystemStatus';

export function ConsolidatedAgentsHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        Consolidated Agents Hub
        <Crown className="h-8 w-8 text-yellow-500" />
      </h1>
      <p className="text-muted-foreground mb-4">
        Sistema tripartite unificado - Todos los agentes ahora usan la metodología estandarizada OpenAI → Perplexity → Claude
      </p>
      
      <UnifiedSystemStatus />
    </div>
  );
}
