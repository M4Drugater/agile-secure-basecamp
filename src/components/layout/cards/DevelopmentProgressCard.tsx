
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface DevelopmentProgressCardProps {
  isAdmin: boolean;
}

export function DevelopmentProgressCard({ isAdmin }: DevelopmentProgressCardProps) {
  return (
    <Card className={!isAdmin ? "md:col-span-2" : ""}>
      <CardHeader>
        <CardTitle>LAIGENT v2.0 Development Progress</CardTitle>
        <CardDescription>
          Current phase status and upcoming features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✅ Phase 1: Foundation Complete</h4>
            <p className="text-sm text-green-700">
              Secure authentication, role-based access control, admin management, and database foundation implemented.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🚧 Phase 2A: AI Features (Current)</h4>
            <p className="text-sm text-blue-700 mb-2">
              CLIPOGINO AI mentor and content generation system with cost monitoring.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
              <div>• CLIPOGINO Chat ✅</div>
              <div>• Content Generator ✅</div>
              <div>• Cost Monitoring ✅</div>
              <div>• Usage Tracking ✅</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">⏳ Coming Next:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Phase 2B: Advanced AI Features</li>
              <li>• Phase 3: Credit-based Payment System</li>
              <li>• Phase 4: Knowledge Library & LMS</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
