
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Eye,
  Brain,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';

// Mock reports data
const mockReports = [
  {
    id: '1',
    title: 'Apple Inc. Competitive Analysis Report',
    reportType: 'Competitive Analysis',
    agentType: 'cia',
    executiveSummary: 'Comprehensive analysis of Apple\'s market position, revealing key opportunities in emerging markets...',
    confidenceLevel: 4,
    createdAt: new Date('2024-01-15'),
    pageCount: 24
  },
  {
    id: '2',
    title: 'Tesla Market Share Visualization Report',
    reportType: 'Market Visualization',
    agentType: 'cdv',
    executiveSummary: 'Visual analysis of Tesla\'s market positioning and competitive landscape in the EV sector...',
    confidenceLevel: 5,
    createdAt: new Date('2024-01-14'),
    pageCount: 18
  }
];

const agentIcons = {
  cdv: Eye,
  cia: Brain,
  cir: Target
};

export function ReportsOverview() {
  const [reports] = useState(mockReports);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Intelligence Reports</h2>
          <p className="text-muted-foreground">Generated reports from your competitive analysis</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {reports.length} Reports
        </Badge>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => {
          const AgentIcon = agentIcons[report.agentType as keyof typeof agentIcons];
          
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
                        <p className="text-muted-foreground text-sm">{report.executiveSummary}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {report.createdAt.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <AgentIcon className="h-4 w-4" />
                          {report.agentType.toUpperCase()}
                        </span>
                        <span>{report.pageCount} pages</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{report.reportType}</Badge>
                        <Badge variant="secondary">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Confidence: {report.confidenceLevel}/5
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
