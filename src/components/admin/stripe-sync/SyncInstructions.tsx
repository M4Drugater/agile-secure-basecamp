
import React from 'react';

export function SyncInstructions() {
  return (
    <div className="text-xs text-muted-foreground">
      <strong>This action will:</strong>
      <ul className="mt-1 ml-4 list-disc space-y-1">
        <li>Create/verify Stripe products and prices in EUR</li>
        <li>Set up subscription plans in the database</li>
        <li>Initialize credit accounts for all users</li>
        <li>Configure AI model pricing for cost calculation</li>
        <li>Verify all system configurations</li>
      </ul>
    </div>
  );
}
