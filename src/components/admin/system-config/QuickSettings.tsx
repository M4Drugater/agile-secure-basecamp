
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function QuickSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Settings</CardTitle>
        <CardDescription>
          Common system settings that can be configured quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Platform Name</Label>
            <Input placeholder="LAIGENT v2.0" />
            <p className="text-xs text-muted-foreground">Display name for the platform</p>
          </div>
          <div className="space-y-2">
            <Label>Max Users Per Organization</Label>
            <Input type="number" placeholder="100" />
            <p className="text-xs text-muted-foreground">Maximum users allowed</p>
          </div>
          <div className="space-y-2">
            <Label>Session Timeout (minutes)</Label>
            <Input type="number" placeholder="30" />
            <p className="text-xs text-muted-foreground">Auto logout after inactivity</p>
          </div>
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input type="email" placeholder="support@laigent.com" />
            <p className="text-xs text-muted-foreground">Contact email for users</p>
          </div>
        </div>
        <Button className="w-full md:w-auto">Save Quick Settings</Button>
      </CardContent>
    </Card>
  );
}
