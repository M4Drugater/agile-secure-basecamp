
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

interface AuditLogRowProps {
  log: {
    id: string;
    created_at: string | null;
    action: string;
    resource_type: string;
    resource_id: string | null;
    user_id: string | null;
    ip_address: unknown | null;
    details: unknown;
  };
}

export function AuditLogRow({ log }: AuditLogRowProps) {
  const getActionBadgeVariant = (action: string) => {
    if (action.includes('create')) return 'default';
    if (action.includes('update')) return 'secondary';
    if (action.includes('delete')) return 'destructive';
    return 'outline';
  };

  const formatDetails = (details: unknown): string => {
    if (!details) return 'No details';
    
    if (typeof details === 'string') {
      return details;
    }
    
    if (typeof details === 'object' && details !== null) {
      try {
        return JSON.stringify(details, null, 2);
      } catch {
        return 'Invalid object';
      }
    }
    
    return String(details);
  };

  return (
    <TableRow>
      <TableCell className="text-sm">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {log.created_at ? new Date(log.created_at).toLocaleString() : 'Unknown'}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getActionBadgeVariant(log.action)}>
          {log.action.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-sm">
        {log.resource_type}
        {log.resource_id && (
          <div className="text-xs text-muted-foreground truncate max-w-xs">
            ID: {log.resource_id}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm font-mono">
            {log.user_id ? log.user_id.slice(0, 8) + '...' : 'System'}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-sm font-mono">
        {log.ip_address ? String(log.ip_address) : 'Unknown'}
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate text-sm text-muted-foreground">
          {formatDetails(log.details)}
        </div>
      </TableCell>
    </TableRow>
  );
}
