
import React from 'react';

export function ConfigurationInfo() {
  return (
    <div className="space-y-2">
      <div className="text-sm">
        <strong>Target Configuration:</strong>
      </div>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li>• Free Plan - 100 credits/month, 10 daily limit</li>
        <li>• Pro Plan - €39/month, 1,000 credits/month, 50 daily limit</li>
        <li>• Enterprise Plan - €99/month, 5,000 credits/month, 200 daily limit</li>
      </ul>
    </div>
  );
}
