
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ProcessingStatusProps {
  status: string;
  isAiProcessed?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProcessingStatus({ 
  status, 
  isAiProcessed = false, 
  size = 'md' 
}: ProcessingStatusProps) {
  const getStatusConfig = (status: string, isAiProcessed: boolean) => {
    if (isAiProcessed) {
      return {
        variant: 'default' as const,
        icon: CheckCircle,
        label: 'AI Processed',
        color: 'text-green-600'
      };
    }

    switch (status) {
      case 'processing':
        return {
          variant: 'secondary' as const,
          icon: Loader2,
          label: 'Processing',
          color: 'text-blue-600',
          animate: true
        };
      case 'completed':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          label: 'Completed',
          color: 'text-green-600'
        };
      case 'failed':
        return {
          variant: 'destructive' as const,
          icon: AlertCircle,
          label: 'Failed',
          color: 'text-red-600'
        };
      case 'pending':
        return {
          variant: 'outline' as const,
          icon: Clock,
          label: 'Pending',
          color: 'text-yellow-600'
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: Clock,
          label: 'Unknown',
          color: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig(status, isAiProcessed);
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <Badge variant={config.variant} className="text-xs">
      <Icon 
        className={`${iconSize} mr-1 ${config.color} ${config.animate ? 'animate-spin' : ''}`} 
      />
      {config.label}
    </Badge>
  );
}
