
import React from 'react';

export function SyncInstructions() {
  return (
    <div className="text-xs text-muted-foreground">
      <strong>This action will repair and configure:</strong>
      <ul className="mt-1 ml-4 list-disc space-y-1">
        <li>Clean incorrect Stripe data in the database</li>
        <li>Create/verify products in Stripe (Pro: €39/month, Enterprise: €99/month)</li>
        <li>Update database with correct Stripe price IDs</li>
        <li>Initialize credit accounts for all users (100 free credits)</li>
        <li>Configure AI model pricing for cost calculation</li>
        <li>Verify all system configurations are working</li>
        <li>Free plan (€0/month) does not require Stripe configuration</li>
      </ul>
      <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 border border-blue-200">
        <strong>Note:</strong> This repair will clean incorrect data and create real products in your Stripe account. Make sure you are using the correct environment (test/live).
      </div>
    </div>
  );
}
