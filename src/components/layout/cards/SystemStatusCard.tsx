
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export function SystemStatusCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          System Status
        </CardTitle>
        <CardDescription>Platform health and status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm font-medium">Database Connected</div>
            <div className="text-xs text-gray-500">All systems operational</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm font-medium">AI Services Active</div>
            <div className="text-xs text-gray-500">CLIPOGINO & Content Gen ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">🚧</div>
            <div className="text-sm font-medium">Phase 2A Active</div>
            <div className="text-xs text-gray-500">AI features available</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
