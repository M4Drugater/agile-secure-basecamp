
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminPanelCard() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Admin Management
        </CardTitle>
        <CardDescription>Access administrative functions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/admin')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin Dashboard
            <ExternalLink className="h-3 w-3 ml-auto" />
          </Button>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• User Management</div>
            <div>• System Config</div>
            <div>• Audit Logs</div>
            <div>• Cost Monitoring</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
