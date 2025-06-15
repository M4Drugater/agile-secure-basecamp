
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Calendar, 
  Filter,
  FileText,
  ExternalLink,
  BarChart3,
  Trash2,
  BookOpen
} from 'lucide-react';
import { ResearchSession } from '@/hooks/research/useEliteResearchEngine';
import { format } from 'date-fns';

interface ResearchHistoryProps {
  sessions: ResearchSession[];
  onSelectSession: (session: ResearchSession) => void;
}

export function ResearchHistory({ sessions, onSelectSession }: ResearchHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'effectiveness' | 'credits'>('date');

  // Filter and sort sessions
  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = session.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           session.industry?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || session.researchType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'effectiveness':
          return b.effectiveness - a.effectiveness;
        case 'credits':
          return b.creditsUsed - a.creditsUsed;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return 'bg-green-500';
    if (effectiveness >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getResearchTypeLabel = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Research History</h3>
          <p className="text-muted-foreground text-center">
            Your research sessions will appear here after you conduct your first research
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Research History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search research sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="quick-scan">Quick Scan</SelectItem>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                <SelectItem value="industry-deep-dive">Industry Deep Dive</SelectItem>
                <SelectItem value="competitive-analysis">Competitive Analysis</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="effectiveness">Effectiveness</SelectItem>
                <SelectItem value="credits">Credits Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredSessions.length} of {sessions.length} sessions
            </p>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filterType !== 'all' && `Filtered by ${getResearchTypeLabel(filterType)}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 
                      className="text-lg font-semibold truncate max-w-2xl hover:text-blue-500 transition-colors"
                      onClick={() => onSelectSession(session)}
                    >
                      {session.query}
                    </h3>
                    <Badge variant="outline">
                      {getResearchTypeLabel(session.researchType)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(session.createdAt), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      {session.sources.length} sources
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {session.creditsUsed} credits
                    </div>
                    {session.industry && (
                      <Badge variant="secondary">{session.industry}</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Effectiveness:</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getEffectivenessColor(session.effectiveness)}`} />
                        <span className="text-sm font-medium">{session.effectiveness}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Quality:</span>
                      <Badge variant="outline">{session.contextQuality}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Format:</span>
                      <Badge variant="outline">{session.outputFormat}</Badge>
                    </div>
                  </div>
                  
                  {session.insights.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Key Insights:</span>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.insights[0]}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectSession(session)}
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="h-4 w-4" />
                    View
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredSessions.length === 0 && sessions.length > 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Matching Sessions</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
