
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PhaseProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Progress</CardTitle>
        <CardDescription>
          Current phase implementation status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Phase 1A: Foundation</span>
            <Badge variant="default" className="bg-green-500">✓ Complete</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Phase 1B: Admin Management</span>
            <Badge variant="default" className="bg-blue-500">🚧 In Progress</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Phase 2: AI-First Core</span>
            <Badge variant="outline">⏳ Planned</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Phase 3: Business Model</span>
            <Badge variant="outline">⏳ Planned</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
