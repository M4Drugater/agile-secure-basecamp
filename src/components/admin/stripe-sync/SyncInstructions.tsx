
import React from 'react';

export function SyncInstructions() {
  return (
    <div className="text-xs text-muted-foreground">
      <strong>This action will:</strong>
      <ul className="mt-1 ml-4 list-disc space-y-1">
        <li>Create products and prices in your Stripe account (Pro: €39/month, Enterprise: €99/month)</li>
        <li>Update the database with correct Stripe price IDs</li>
        <li>Initialize credit accounts for all users (100 free credits)</li>
        <li>Set up AI model pricing for cost calculation</li>
        <li>Verify all system configurations are working</li>
        <li>Skip creating Stripe products for the Free plan (€0/month)</li>
      </ul>
      <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 border border-blue-200">
        <strong>Note:</strong> This will create actual products in your Stripe account. Make sure you're using the correct environment (test/live).
      </div>
    </div>
  );
}
