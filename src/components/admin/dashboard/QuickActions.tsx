
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Settings, BarChart3, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export function QuickActions() {
  const navigate = useNavigate();
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  const handleAction = async (actionKey: string, action: () => void | Promise<void>) => {
    setLoadingActions(prev => ({ ...prev, [actionKey]: true }));
    
    try {
      await action();
      toast({
        title: "Action completed",
        description: "The action was executed successfully.",
      });
    } catch (error) {
      toast({
        title: "Action failed",
        description: "There was an error executing the action.",
        variant: "destructive",
      });
    } finally {
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const quickActions = [
    {
      key: 'users',
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      action: () => navigate('/admin?tab=users'),
    },
    {
      key: 'config',
      title: 'System Config',
      description: 'Configure system settings',
      icon: Settings,
      action: () => navigate('/admin?tab=config'),
    },
    {
      key: 'analytics',
      title: 'View Analytics',
      description: 'Review platform analytics',
      icon: BarChart3,
      action: () => navigate('/content-analytics'),
    },
    {
      key: 'security',
      title: 'Security Logs',
      description: 'Monitor security events',
      icon: Shield,
      action: () => navigate('/admin?tab=logs'),
    },
  ];

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
          {quickActions.map(({ key, title, description, icon: Icon, action }) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto flex flex-col items-center p-4 hover:bg-primary/5 transition-colors"
                  onClick={() => handleAction(key, action)}
                  disabled={loadingActions[key]}
                >
                  {loadingActions[key] ? (
                    <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                  ) : (
                    <Icon className="h-6 w-6 mb-2" />
                  )}
                  <span className="text-sm font-medium">{title}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
