
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, BarChart3, Shield } from 'lucide-react';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common administrative tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto flex flex-col items-center p-4">
            <Users className="h-6 w-6 mb-2" />
            <span className="text-sm">Manage Users</span>
          </Button>
          <Button variant="outline" className="h-auto flex flex-col items-center p-4">
            <Settings className="h-6 w-6 mb-2" />
            <span className="text-sm">System Config</span>
          </Button>
          <Button variant="outline" className="h-auto flex flex-col items-center p-4">
            <BarChart3 className="h-6 w-6 mb-2" />
            <span className="text-sm">View Analytics</span>
          </Button>
          <Button variant="outline" className="h-auto flex flex-col items-center p-4">
            <Shield className="h-6 w-6 mb-2" />
            <span className="text-sm">Security Logs</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
