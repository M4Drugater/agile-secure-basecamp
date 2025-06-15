
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap, Network } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Enhanced Competitive Intelligence Platform
        </h1>
        <p className="text-gray-600 mt-1">
          Unified collaborative analysis with intelligent outputs
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-600 flex items-center gap-1 px-4 py-2">
          <Zap className="h-4 w-4" />
          AI-Powered
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1 px-4 py-2">
          <Network className="h-4 w-4" />
          Collaborative
        </Badge>
      </div>
    </div>
  );
}
