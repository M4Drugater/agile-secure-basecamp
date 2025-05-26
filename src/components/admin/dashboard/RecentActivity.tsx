
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  action: string;
  resource_type: string;
  created_at?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest system events and user actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">
                  {activity.action.replace('_', ' ')} on {activity.resource_type}
                </p>
                <p className="text-muted-foreground text-xs">
                  {activity.created_at ? new Date(activity.created_at).toLocaleString() : 'Unknown time'}
                </p>
              </div>
            </div>
          ))}
          {(!activities || activities.length === 0) && (
            <p className="text-muted-foreground text-sm">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
