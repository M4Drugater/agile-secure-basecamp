
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function HistoryTab() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Alert History</h3>
        <p className="text-muted-foreground">
          Historical alert data will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}
