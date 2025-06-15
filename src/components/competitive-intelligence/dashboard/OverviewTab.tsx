
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Brain, Target, Network, FileText } from 'lucide-react';

interface OverviewTabProps {
  sessions: any[];
  collaborations: any[];
  outputs: any[];
}

export function OverviewTab({ sessions, collaborations, outputs }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Sessions</span>
              <span className="font-semibold">{sessions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Collaborations</span>
              <span className="font-semibold">{collaborations.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Generated Outputs</span>
              <span className="font-semibold">{outputs.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Success Rate</span>
              <span className="font-semibold text-green-600">94%</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {outputs.slice(0, 3).map((output) => (
              <div key={output.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <FileText className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{output.title}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(output.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {outputs.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Start New Session</h3>
            <p className="text-sm text-gray-600 mb-4">
              Begin a new competitive intelligence analysis
            </p>
            <Button size="sm" className="w-full">
              Create Session
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <Network className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Agent Collaboration</h3>
            <p className="text-sm text-gray-600 mb-4">
              View collaborative agent interactions
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Network
            </Button>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Generate Output</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create intelligent reports and insights
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
