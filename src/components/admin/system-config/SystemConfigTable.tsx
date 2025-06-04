
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SystemConfig } from './types';
import { EditConfigDialog } from './EditConfigDialog';

interface SystemConfigTableProps {
  configs: SystemConfig[] | undefined;
  isLoading: boolean;
}

export function SystemConfigTable({ configs, isLoading }: SystemConfigTableProps) {
  const formatValue = (value: any) => {
    if (typeof value === 'string') return value;
    return JSON.stringify(value, null, 2);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading configurations...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs?.map((config) => (
            <TableRow key={config.id}>
              <TableCell className="font-medium">{config.key}</TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate text-sm">
                  {formatValue(config.value)}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {config.description || 'No description'}
              </TableCell>
              <TableCell>
                <Badge variant={config.is_public ? 'default' : 'secondary'}>
                  {config.is_public ? 'Public' : 'Private'}
                </Badge>
              </TableCell>
              <TableCell>
                <EditConfigDialog config={config} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
