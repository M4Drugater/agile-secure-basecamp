
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Coins,
  FileText,
  CheckCircle,
  Activity
} from 'lucide-react';
import { ResearchAnalytics, ResearchSession } from '@/hooks/research/useEliteResearchEngine';

interface ResearchAnalyticsDashboardProps {
  analytics?: ResearchAnalytics;
  sessions: ResearchSession[];
}

export function ResearchAnalyticsDashboard({ analytics, sessions }: ResearchAnalyticsDashboardProps) {
  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Analytics</h3>
          <p className="text-muted-foreground text-center">
            Analyzing your research patterns and effectiveness
          </p>
        </CardContent>
      </Card>
    );
  }

  const recentSessions = sessions.slice(0, 5);
  const averageCreditsPerSession = analytics.totalSessions > 0 ? 
    Math.round(analytics.creditsUsed / analytics.totalSessions) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Research Sessions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              +{sessions.filter(s => {
                const sessionDate = new Date(s.createdAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return sessionDate > weekAgo;
              }).length} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sources Discovered</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSourcesFound}</div>
            <p className="text-xs text-muted-foreground">
              Avg {Math.round(analytics.totalSourcesFound / Math.max(analytics.totalSessions, 1))} per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Effectiveness Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageEffectiveness}%</div>
            <Progress value={analytics.averageEffectiveness} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.creditsUsed}</div>
            <p className="text-xs text-muted-foreground">
              Avg {averageCreditsPerSession} per session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Research Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Industries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Research Industries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topIndustries.slice(0, 5).map((industry, index) => (
              <div key={industry.industry} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium">{industry.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{industry.count}</span>
                  <Badge variant="secondary">{index + 1}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Favorite Research Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Research Type Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.favoriteResearchTypes.slice(0, 4).map((type, index) => (
              <div key={type.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {type.type.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-muted-foreground">{type.count}</span>
                </div>
                <Progress 
                  value={(type.count / Math.max(...analytics.favoriteResearchTypes.map(t => t.count))) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Sessions Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium truncate max-w-md">
                    {session.query}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="capitalize">{session.researchType.replace('-', ' ')}</span>
                    <span>{session.sources.length} sources</span>
                    <span>{session.creditsUsed} credits</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={session.effectiveness >= 80 ? 'default' : 'secondary'}>
                    {session.effectiveness}%
                  </Badge>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.timeSpent / 60)}h {analytics.timeSpent % 60}m
            </div>
            <p className="text-xs text-muted-foreground">
              Avg {Math.round(analytics.timeSpent / Math.max(analytics.totalSessions, 1))}m per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Quality</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => s.effectiveness >= 80).length}/{sessions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              High-quality sessions (80%+)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sources/Session</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.totalSourcesFound / Math.max(analytics.totalSessions, 1))}
            </div>
            <p className="text-xs text-muted-foreground">
              High-credibility sources
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
