
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Calendar,
  Eye,
  Brain,
  Target,
  MoreVertical,
  Play,
  Archive,
  FileText
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock data for demonstration
const mockSessions = [
  {
    id: '1',
    sessionName: 'Apple Inc. Market Analysis',
    agentType: 'cia',
    companyName: 'Apple Inc.',
    industry: 'Technology',
    analysisFocus: 'Product Features',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    reportsCount: 3,
    insightsCount: 7
  },
  {
    id: '2',
    sessionName: 'Tesla Competitive Intelligence',
    agentType: 'cdv',
    companyName: 'Tesla',
    industry: 'Automotive',
    analysisFocus: 'Market Share',
    status: 'completed',
    createdAt: new Date('2024-01-10'),
    reportsCount: 5,
    insightsCount: 12
  }
];

const agentIcons = {
  cdv: Eye,
  cia: Brain,
  cir: Target
};

const agentColors = {
  cdv: 'bg-blue-500',
  cia: 'bg-purple-500',
  cir: 'bg-green-500'
};

export function SessionManager() {
  const [sessions] = useState(mockSessions);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Intelligence Sessions</h2>
          <p className="text-muted-foreground">Manage your competitive analysis sessions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first competitive intelligence session'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => {
            const AgentIcon = agentIcons[session.agentType as keyof typeof agentIcons];
            const agentColor = agentColors[session.agentType as keyof typeof agentColors];

            return (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 ${agentColor} rounded-lg flex items-center justify-center`}>
                        <AgentIcon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{session.sessionName}</h3>
                          <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {session.createdAt.toLocaleDateString()}
                          </span>
                          <span>Agent: {session.agentType.toUpperCase()}</span>
                          <span>Industry: {session.industry}</span>
                          <span>Focus: {session.analysisFocus}</span>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span>{session.reportsCount} Reports</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-green-500" />
                            <span>{session.insightsCount} Insights</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View Reports
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Target className="h-4 w-4 mr-2" />
                            View Insights
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
