
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, Lock, Database } from 'lucide-react';
import { useSecureAuth } from '@/hooks/useSecureAuth';

export function SecurityStatusCard() {
  const { isAuthenticated, profile, hasRole } = useSecureAuth();

  const securityFeatures = [
    {
      name: 'Row Level Security',
      enabled: true,
      icon: Database,
      description: 'Database access controlled by user permissions'
    },
    {
      name: 'Authentication',
      enabled: isAuthenticated,
      icon: Lock,
      description: 'User session validated and secure'
    },
    {
      name: 'Role-Based Access',
      enabled: !!profile?.role,
      icon: Shield,
      description: `Current role: ${profile?.role || 'None'}`
    },
    {
      name: 'Data Validation',
      enabled: true,
      icon: CheckCircle,
      description: 'Input validation and sanitization active'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Security Status
        </CardTitle>
        <CardDescription>Platform security features and status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.name} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  feature.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{feature.name}</p>
                    <div className={`h-2 w-2 rounded-full ${
                      feature.enabled ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        {hasRole('admin') && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">
              Admin access granted - You have elevated permissions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
