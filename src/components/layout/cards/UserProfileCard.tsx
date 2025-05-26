
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function UserProfileCard() {
  const { user, profile } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Profile Status
        </CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Email:</span>
          <span className="text-sm font-medium">{user?.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Role:</span>
          <Badge variant="outline" className="text-xs">
            {profile?.role?.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <Badge variant={profile?.is_active ? "default" : "destructive"} className="text-xs">
            {profile?.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Member Since:</span>
          <span className="text-sm font-medium">
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
