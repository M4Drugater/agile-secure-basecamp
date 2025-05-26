
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

interface SystemHealthProps {
  configurations: number;
  version: string;
}

export function SystemHealth({ configurations, version }: SystemHealthProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Database Connection</span>
          <Badge variant="default" className="bg-green-500">
            ✓ Connected
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Authentication Service</span>
          <Badge variant="default" className="bg-green-500">
            ✓ Operational
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">RLS Policies</span>
          <Badge variant="default" className="bg-green-500">
            ✓ Active
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Audit Logging</span>
          <Badge variant="default" className="bg-green-500">
            ✓ Enabled
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Configurations</span>
          <Badge variant="outline">
            {configurations}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Platform Version</span>
          <Badge variant="secondary">
            v{version}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
