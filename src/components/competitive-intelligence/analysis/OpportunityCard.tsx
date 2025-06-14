
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface OpportunityCardProps {
  opportunity: {
    description: string;
    marketSize: string;
    competitiveAdvantage: string;
    resourceRequirement: string;
    timeline: string;
  };
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm mb-2">{opportunity.description}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium text-muted-foreground">Market Size:</span>
            <p>{opportunity.marketSize}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Timeline:</span>
            <p>{opportunity.timeline}</p>
          </div>
          <div className="col-span-2">
            <span className="font-medium text-muted-foreground">Competitive Advantage:</span>
            <p>{opportunity.competitiveAdvantage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
